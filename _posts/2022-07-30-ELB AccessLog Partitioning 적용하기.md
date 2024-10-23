---
title: "[Data Structure] unordered_map 사용법"
date: 2024-10-23 00:00:00 +09:00
categories: [AWS, ELB]
tags: [aws, elb, alb, accesslog, athena, partitoning]
image: 
# ------------------------------------------------------------------
# 포스트 작성 시 참고 URL
# https://chirpy.cotes.page/posts/write-a-new-post/
# https://chirpy.cotes.page/posts/text-and-typography/
---



## unordered_map

- map보다 더 빠른 탐색을 하기 위한 자료구조다.
- unordered_map은 해쉬테이블로 구현한 자료구조로 탐색 시간복잡도는 O(1)이다.
- map은 Binary Search Tree로 탐색 시간 복잡도는 O(log n)이다.
- unordered_map을 사용하기 위해서는 #include<unordered_map>을 선언해야 한다.
- unordered_map은 중복된 데이터를 허용하지 않고 map에 비해 데이터가 많을 시 월등히 좋은 성능을 보인다. 하지만 key가 유사한 데이터가 많을 시 해시 충돌로 인해 성능이 떨어질 수도 있다.

<br>

## 함수

<br>

- **empty()** <br>
  맵이 비어있는지 확인하는 함수.
  if unordered_map is empty, then return 1 else 0

- **size()** <br>
  맵의 크기를 확인하는 함수
  return size_type ( unsigned int)

- **operator[]**  <br>
  맵에서 key를 통해 value를 지정하는 operator
  map_name[key]=value

- **find(key)**  <br>
  맵에서 key에 해당하는 원소를 찾는 함수
  if key is contained, then iterator else map_name.end()

- **count(key)** <br>
  맵에서 key에 해당하는 원소의 갯수를 반환하는 함수
  if key is contained, return 1 else 0

- **insert({key, value})** <br>
  맵에 pair<key, value>를  추가하는 함수
  if key is contained, then not insert

- **erase(key)** <br>
  맵에서 key에 해당하는 원소를 제거하는 함수
  erase 하는 바업: 특정 position의 pair 삭제, key를 통해 삭제, 범위 삭제

- **clear()** <br>
  맵을 초기화 하는 함수

- **operator=** <br>
  대입 연산자 가능

index로 접근할 수 없고 iterator로 접근해야 한다. <br>
시작은 begin(), 끝은 end() <br>
key: iter->first, value: iter->second <br>
반복문 사용시 auto 활용 or pair<key_type, value_type> 사용 <br>

## 예제


  ```
    unordered_map<string, int> nameToIndex;
    for(int i=0; i<names.size(); ++i>){
      nameToIndex[names[i]]=i;
    }

    vector<vector<int>> table(names.size(), vector<int>(names.size(),0)); 
    //nxn 이차원 배열을 0으로 초기화

    string A="muzi";
    string B="frodo";

    int indexA=nameToIndex[A];
    int indexB=nameToIndex[B];

    table[indexA][indexB]++;

  ```

- 파티션 추가 및 확인

  ```sql
  ALTER TABLE alb_logs
  ADD PARTITION (year='2022', month='07', day='28') 
  LOCATION 's3://test-alb-access-logs-s3/AWSLogs/111111111111/elasticloadbalancing/ap-northeast-2/2022/07/28/'
  
  SHOW PARTITIONS alb_logs;
  ---
  year=2022/month=07/day=27
  year=2022/month=07/day=28
  ```

<br>

위와 같이 구성한 경우 매일마다 파티션을 별도로 추가하거나 분석 시 파티션을 추가해줘야 하는데, 
아래와 같이 EventBridge + Lambda를 사용해서 매일 00:05분에 파티션을 추가하도록 코드를 작성한 후 설정했습니다.

- EventBridge, Lambda 구성

  - EventBridge

    ![Untitled](/assets/img/posts/image-202207305832817.png)

  - Lambda

    - 제한 시간 : 10초

    - 환경 변수

      ![Untitled 1](/assets/img/posts/image-202207305832818.png)

    - 권한

      ```json
      {
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Effect": "Allow",
                  "Action": [
                      "athena:*"
                  ],
                  "Resource": [
                      "*"
                  ]
              },
              {
                  "Effect": "Allow",
                  "Action": [
                      "glue:GetDatabase",
                      "glue:GetDatabases",
                      "glue:UpdateDatabase",
                      "glue:UpdateTable",
                      "glue:GetTable",
                      "glue:GetTables",
                      "glue:BatchCreatePartition",
                      "glue:BatchGetPartition",
                      "glue:CreatePartition",
                      "glue:UpdatePartition",
                      "glue:GetPartition",
                      "glue:GetPartitions"
                  ],
                  "Resource": [
                      "*"
                  ]
              },
              {
                  "Effect": "Allow",
                  "Action": [
                      "s3:GetObject",
                      "s3:GetBucketLocation",
                      "s3:ListBucket",
                      "s3:PutObject"
                  ],
                  "Resource": [
                      "arn:aws:s3:::test-alb-access-logs-s3",
                      "arn:aws:s3:::test-alb-access-logs-s3/*"
                  ]
              },
      				{
                  "Effect": "Allow",
                  "Action": [
                      "s3:PutObject"
                  ],
                  "Resource": [
                      "arn:aws:s3:::test-alb-access-logs-s3/Athena/Result",
                      "arn:aws:s3:::test-alb-access-logs-s3/Athena/Result/*"
                  ]
              }
          ]
      }
      ```

    - 코드

      ```python
      import boto3
      import time
      import os
      from datetime import timedelta
      from datetime import datetime
      
      def lambda_handler(event, context):
          database = os.environ['DATABASE']
          table = os.environ['TABLE']
          log_path = os.environ['LOG_PATH']
          result_path = os.environ['RESULT_PATH']
          
          utc_now = datetime.utcnow()
          year = utc_now.strftime('%Y')
          month = utc_now.strftime('%m')
          date_added = timedelta(days=1)
          day = (utc_now + date_added).strftime('%d')
          
          query = (
              f"ALTER TABLE {database}.{table} "
              f"ADD IF NOT EXISTS PARTITION (year={year},month={month},day={day}) "
              f"LOCATION '{log_path}{year}/{month}/{day}/';"   #log_path 값 마지막에 /가 포함된 경우  utc_now.year 사이 / 중복 체크 필요.
          )
          print(query)
          client = boto3.client('athena')
          try:
              response = client.start_query_execution(
                  QueryString = query,
                  QueryExecutionContext = {
                      'Database': database
                  },
                  ResultConfiguration = {
                      'OutputLocation': result_path
                  }
              )
          except Exception as e:
              print(e)
      ```

<br>

## 테스트

- ALB 로그 분석용 쿼리 예시

  ```sql
  SELECT * FROM alb_logs
  WHERE (
  		year LIKE '2022'
  		AND month LIKE '07'
  		AND day LIKE '28'
  	  )
  	AND elb LIKE 'app/test-alb-access-logs-s3/51219687d121212e'
  	AND (
  		parse_datetime(time, 'yyyy-MM-dd''T''HH:mm:ss.SSSSSS''Z') 
  		BETWEEN parse_datetime('2022-07-28-00:30:00', 'yyyy-MM-dd-HH:mm:ss')
  		AND parse_datetime('2022-07-28-00:45:00', 'yyyy-MM-dd-HH:mm:ss')
  		)
      AND elb_status_code LIKE '5%';
  ```

- 쿼리 결과
  ![Untitled 2](/assets/img/posts/image-202207305832819.png)

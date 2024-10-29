---
title: 분할 정복 알고리즘
date: 2024-10-25 15:33:44 +09:00
categories: [DevOps, argocd]
tags: [argocd, deployment, sockshop]
image: /assets/img/posts/image-20230722192343071.png

---


## 개요
주어진 문제의 입력을 분할하여 문제를 해결하는 방식의 알고리즘이다. <br>
분할한 입력에 대해 각각 동일한 알고리즘을 적용해서 해를 계산하고 이 값을 취합해 원래 문제의 해를 구한다.  <br>
부분 문제는 더 이상 분할 불가능할 때 까지 분할한다.   <br>


## 합병 정렬
![img](/assets/img/posts/Chapter3-1.png)

부분 문제의 크기가 1/2로 감소하는 분할 정복 알고리즘이다. <br>
시간복잡도는 모든 경우에서 **NlogN**이다. 

대부분의 정렬 알고리즘은 입력을 위한 메모리 공간과 O(1)크기의 메모리 공간만 사용한다. <br>
합병 정렬은 입력을 위한 메모리 공간과 입력과 동일 크기의 임시배열이 필요하며, 공간 복잡도는 **O(n)**이다.

### 코드
```c++
#include <vector>

using namespace std;

void mergeSort(vector<int> &v, int s, int e){
    if(s>=e) return;

    int m=(s+e)/2;
    
    //분할
    mergeSort(v,s,m); //s~m
    mergeSort(v,m+1,e) //m+1~e
    
    //취합
    vector<int> ret(e+1);
    int ret_idx=0;
    int i=s, j=m+1; 

    //결과를 저장할 배열에 하나씩 비교하며 저장
    while(i<=m&&j<=e){
        if(v[i]<v[j]) ret[ret_idx++] = v[i++];
        else ret[ret_idx++]=v[j++];
    }

    //남은 값을 뒤에 채워줌
    while(i<=m) ret[ret_idx++]=v[i++];
    while(j<=e) ret[ret_idx++]=v[j++];

    //원래 배열에 복사
    for(int k=s, ret_idx=0; k<=e; k++; ret_idx++)
        v[k]=ret[ret_idx];
}

```


## 퀵 정렬
문제를 2개의 부분 문제로 분할한다. 각 부분 문제의 크기가 일정하지 않다. <br>
피봇을 기준으로 피봇보다 작은숫자는 피봇의 왼쪽, 큰 숫자는 오른쪽으로 분할하며, 분할된 부분 문제에서 이를 반복한다.

### 코드
피봇을 배열에서 선택하고, 피봇을 정렬된 배열의 start와 바꾼 후, 피봇과 배열의 각 원소를 비교해 피봇보다 작은 숫자는 피봇보다 작은 그룹으로 옮기고, 큰 숫자들은 큰 그룹으로 옮긴 후 피봇은 중간자리에 놓는다.
```c++
void swap(int & first, int& second){
    int temp=first;
    first=second;
    second=temp;
}

void recursion(vector<int>& buf, int start, int end){
    if(start>=end) return;

    int& pivot=buf[start];
    int left=start+1;
    int right=end;

    while(true){
        while(left<=right && buf[left]<=pivot)
            ++left;
        while(left<=right && but[right]>pivot)
            --right;
            
        if(left>right) break;
        swap(buf[left], buf[right]);

    }

    swap(pivot, but[right]);
    recursion(buf, start, right-1);
    recursion(buf, right+1, end);

    
}
```
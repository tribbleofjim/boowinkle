#ifndef HASH_H
#define HASH_H
#include<iostream>
#include<string>
#include<cstdlib>
using namespace std;

//用户结构体
struct user{
    string number;//电话号码
    string username;//用户名
    string location;//地址
};

//以用户结构体为节点值
struct ChainNode{
    user u;
    ChainNode* next;
    ChainNode* last;
    ChainNode():next(NULL),last(NULL){}
};

//查询时用于存放位置和查询长度的结构体
struct Q{
    int loc;
    int len;
};

//以用户名为关键字的哈希表
//第一种：数组形式的哈希表
class myUserHash1{
    public:
        myUserHash1();
        bool Add(user u);
        bool Delete(user u);
        int Key(string username);
        Q Search(string username);
        user myusers[100];
};



//第二种：链表结构的哈希表
class myUserHash2{
    public:
        myUserHash2();
        void Add(ChainNode* node);
        bool Delete(user u);
        int Search(string username,ChainNode*& p);
        int Key(string username);
        user standu;
        ChainNode* myusers[26];
};



//以电话号码为关键字的哈希表
class myNumHash1{
    public:
        myNumHash1();
        bool Add(user u);
        bool Delete(user u);
        int Key(string number);
        Q Search(string number);
        user myusers[100];
};


//链表结构
class myNumHash2{
    public:
        myNumHash2();
        void Add(ChainNode* node);
        bool Delete(user u);
        int Search(string number,ChainNode*& p);
        int Key(string number);
        user standu;
        ChainNode* myusers[18];
};

#endif // HASH_H

#include "hash.h"

myUserHash1::myUserHash1(){
    user standu;
    standu.username="";
    standu.number="";
    standu.location="";
    for(int i=0;i<100;i++){
        myusers[i]=standu;
    }
}

int myUserHash1::Key(string username){
    int f=username[0]-97;//这是首字母
    //int key=l+f;
    int key=f;
    return key;
}

bool myUserHash1::Add(user u){
    //全部转化为小写字符
    for(int i=0; i<u.username.length();i++){
        if(u.username[i]>'A'&&u.username[i]<'Z'){
            u.username[i]=u.username[i]+32;
        }
    }

    int key=Key(u.username);
    //查询看有没有重名，有则不能加入
    Q q=Search(u.username);
    /*
    if(q.loc!=-1){
        //表中已经有这个用户
        return false;
    }*/

    //安排进哈希表
    if(myusers[key].username==""){
        myusers[key]=u;
    }
    else{
        int k=key+1;
        while(myusers[k].username!=""&&k!=key){
            k=(k+1)%100;
        }
        if(k!=key){
            //找到一个空位
            myusers[k]=u;
        }
        else{
            //哈希表已满，异常处理
            return false;
        }
    }
    return true;
}

Q myUserHash1::Search(string username){
    Q s;
    //若没有这个用户则返回-1
    int re=-1;
    int len=0;
    int key=Key(username);
    if(myusers[key].username==""){
        re=key;
        s.loc=re;
        s.len=len;
        return s;
    }
    else{
        if(myusers[key].username==username){
            re=key;
            len++;
        }
        else{
            int k=key+1;
            len+=2;
            while(myusers[k].username!=""&&k!=key&&myusers[k].username!=username){
                k=(k+1)%100;
                len++;
            }
            if(myusers[k].username==username){
                re=k;
            }
            else{
                s.loc=re;
                s.len=len;
                return s;
            }
        }
    }
    s.loc=re;
    s.len=len;
    return s;
}

bool myUserHash1::Delete(user u){
    int flag=Search(u.username).loc;
    if(flag==-1){
        //无该用户，抛出异常
        return false;
    }
    //置空该处
    user standu;
    standu.username="";
    myusers[flag]=standu;
    //调整表中其他所有的元素，碰到空格就停下
    int k=flag+1;
    while(k!=flag&&myusers[k].username!=""){
        Add(myusers[k]);
        k=(k+1)%100;
    }
    return true;
}

//第二个哈希表
myUserHash2::myUserHash2(){
    ChainNode* standnode=new ChainNode();
    standu.username="";
    standu.number="";
    standu.location="";
    standnode->next=0;
    standnode->last=0;
    standnode->u=standu;
    for(int i=0;i<26;i++){
        myusers[i]=standnode;
    }
}

int myUserHash2::Search(string username,ChainNode*& p){
    int len=-1;//查找长度
    //p是用来保存寻找到的那个节点
    int k=Key(username);
    //cout<<"Key值是"<<k<<endl;
    if(k>=0){
        p=myusers[k];
        //cout<<"指针赋值没有问题"<<endl;
        len=1;
        while(p->next!=0&&p->u.username!=username){
            string s=p->u.username;
            p=p->next;
            len++;
            string ss=p->u.username;
            if(s==ss){
                break;
            }
            cout<<"len++"<<len<<endl;
        }
        //cout<<"while循环结束";
        //cout<<p->u.username<<endl;
        if(p->u.username!=username){
            //没有该用户
            len=-1;
        }
    }
    return len;
}

int myUserHash2::Key(string username){
    int k=username[0]-97;
    //cout<<"Key函数里的k值"<<k<<endl;
    return k;
}

void myUserHash2::Add(ChainNode* node){
    node->next=0;
    node->last=0;
    //cout<<"初始化完成"<<endl;
    int key=Key(node->u.username);
    if(myusers[key]->u.username==""){
        myusers[key]=node;
    }
    else{
        ChainNode* p;
        p=myusers[key];
        while(p->next)
            p=p->next;
        p->next=node;
        node->last=p;
        node->next=0;
        cout<<node->next<<endl;
        cout<<p->next->next<<endl;
    }
}

bool myUserHash2::Delete(user u){
    ChainNode* p;
    Search(u.username,p);
    if(p->u.username==""){
        //不存在这个节点，抛异常
        return false;
    }
    if(p->next==nullptr){
        p->u.username="";
    }
    else{
        p->last->next=nullptr;
    }
    return true;
}

//第三个哈希表
myNumHash1::myNumHash1(){
    user standu;
    standu.username="";
    standu.number="";
    standu.location="";
    for(int i=0;i<100;i++){
        myusers[i]=standu;
    }
}

int myNumHash1::Key(string number){
    int res = (number[0]-'0'-1)+(number[1]-'0')+(number[2]-'0');
    return res;
}

bool myNumHash1::Add(user u){
    //获取哈希值
    int key=Key(u.number);

    //安排进哈希表
    if(myusers[key].number==""){
        myusers[key]=u;
    }
    else{
        int k=key+1;
        while(myusers[k].number!=""&&k!=key){
            k=(k+1)%100;
        }
        if(k!=key){
            //找到一个空位
            myusers[k]=u;
        }
        else{
            //哈希表已满，异常处理
            return false;
        }
    }
    return true;
}

Q myNumHash1::Search(string number){
    Q s;
    //若没有这个用户则返回-1
    int re=-1;
    int len=0;
    int key=Key(number);
    if(myusers[key].number==""){
        re=key;
        s.loc=re;
        s.len=len;
        return s;
    }
    else{
        if(myusers[key].number==number){
            re=key;
            len++;
        }
        else{
            int k=key+1;
            while(myusers[k].number!=""&&k!=key&&myusers[k].number!=number){
                k=(k+1)%100;
                len++;
            }
            if(myusers[k].number==number){
                re=k;
            }
            else{
                s.loc=re;
                s.len=len;
                return s;
            }
        }
    }
    s.loc=re;
    s.len=len;
    return s;
}

bool myNumHash1::Delete(user u){
    int flag=Search(u.number).loc;
    if(flag==-1){
        //无该用户，抛出异常
    }
    //置空该处
    user standu;
    standu.username="";
    myusers[flag]=standu;
    //调整表中其他所有的元素，碰到空格就停下
    int k=flag+1;
    while(k!=flag&&myusers[k].number!=""){
        Add(myusers[k]);
    }

}

//第四个哈希表
myNumHash2::myNumHash2(){
    ChainNode* standnode=new ChainNode();
    standu.username="";
    standu.number="";
    standu.location="";
    standnode->u=standu;
    for(int i=0;i<18;i++){
        myusers[i]=standnode;
    }
}

int myNumHash2::Key(string number){
    int k=(number[0]-'0'-1)+(number[1]-'0')+(number[2]-'0');
    return k;
}

void myNumHash2::Add(ChainNode* node){
    node->next=0;
    node->last=0;
    int key=Key(node->u.number);
    //cout<<"用户"<<node->u.username<<"的key值是"<<key<<endl;
    if(myusers[key]->u.number==""){
        myusers[key]=node;
        //cout<<"添加到用户"<<node->u.username<<endl;
    }
    else{
        ChainNode* p;
        p=myusers[key];
        while(p->next)
            p=p->next;
        p->next=node;
        node->last=p;
        //node->next=0;
        //cout<<node->next<<endl;
        //cout<<p->next->next<<endl;
        //cout<<"添加到用户"<<node->u.username<<endl;
    }
}

bool myNumHash2::Delete(user u){
    ChainNode* p;
    Search(u.number,p);
    if(p->u.number!=""){
        //不存在这个节点，抛异常
    }
    p->last->next=0;
    return true;
}

int myNumHash2::Search(string number,ChainNode*& p){
    int len=0;//查找长度
    //p是用来保存寻找到的那个节点
    int k=Key(number);
    //cout<<"Key值是"<<k<<endl;
    if(k>=0){
        p=myusers[k];
        //cout<<"指针赋值没有问题"<<endl;
        len=1;
        while(p->next&&p->u.number!=number){
            //cout<<p->u.number;
            p=p->next;
            len++;
            //cout<<"指针往后移了一个"<<endl;
            //cout<<p->next<<endl;
            //cout<<p->u.number<<endl;
        }
        //cout<<"while循环结束";
        //cout<<p->u.number<<endl;
        if(p->u.number!=number){
            //没有该用户，抛异常
        }
    }
    return len;
}

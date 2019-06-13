#include "query.h"
#include "ui_query.h"
#include <QDebug>
#include <QStandardItemModel>
#include <QMessageBox>
#include "hash.h"

query::query(QWidget *parent,myUserHash1 * uHash1,
             myUserHash2 * uHash2,myNumHash1 * nHash1,
             myNumHash2 * nHash2) :
    QDialog(parent),
    ui(new Ui::query)
{
    ui->setupUi(this);
    this->uHash1=uHash1;
    this->uHash2=uHash2;
    this->nHash1=nHash1;
    this->nHash2=nHash2;

    this->model=new QStandardItemModel;
    //设置表头
    this->model->setHorizontalHeaderItem(0,new QStandardItem("姓名"));
    this->model->setHorizontalHeaderItem(1,new QStandardItem("电话号码"));
    this->model->setHorizontalHeaderItem(2,new QStandardItem("地址"));
    this->model->setHorizontalHeaderItem(3,new QStandardItem("查询长度"));
    //将表设置进去
    this->ui->tableView->setModel(model);
}

query::~query()
{
    delete ui;
}

void query::display(int row,user u,int len){
    this->model->setItem(row,0,new QStandardItem(
                             QString::fromStdString(u.username)));
    this->model->setItem(row,1,new QStandardItem(
                             QString::fromStdString(u.number)));
    this->model->setItem(row,2,new QStandardItem(
                             QString::fromStdString(u.location)));
    this->model->setItem(row,3,new QStandardItem(
                             QString::number(len)));
}

void query::on_btn_search_clicked()
{
    try {
        QString key = this->ui->comboBox->currentText();
        int flag=-1;
        if(key=="按姓名查询"){
            flag=0;
            key = this->ui->edit_key->text();
        }
        else if(key=="按电话号码查询"){
            flag=1;
            key = this->ui->edit_key->text();
        }
        else{
            QMessageBox msg;
            msg.setText("输入错误，请重试");
            msg.setDefaultButton(QMessageBox::Ok);
        }
        if(flag==0){
            //cout<<"yes"<<endl;
            Q q=uHash1->Search(key.toStdString());
            ChainNode * p;
            int l=uHash2->Search(key.toStdString(),p);
            if(q.loc==-1 | l==-1){
                QMessageBox msg;
                msg.setText("查询不到该用户");
                msg.setDefaultButton(QMessageBox::Ok);
            }
            user u;
            u.username=uHash1->myusers[q.loc].username;
            u.number=uHash1->myusers[q.loc].number;
            u.location=uHash1->myusers[q.loc].location;
            display(0,u,q.len);
            display(1,u,l);
        }
        else if(flag==1){
            Q q=nHash1->Search(key.toStdString());
            ChainNode * p;
            int l=nHash2->Search(key.toStdString(),p);
            if(q.loc==-1||l==-1){
                QMessageBox msg;
                msg.setText("查询不到该用户");
                msg.setDefaultButton(QMessageBox::Ok);
            }
            user u;
            u.username=nHash1->myusers[q.loc].username;
            u.number=nHash1->myusers[q.loc].number;
            u.location=nHash1->myusers[q.loc].location;
            display(0,u,q.len);
            display(1,u,l);
        }
        else
            return;
    } catch (exception e) {
        QMessageBox msg;
        msg.setText("查询不到该用户");
        msg.setDefaultButton(QMessageBox::Ok);
    }
}

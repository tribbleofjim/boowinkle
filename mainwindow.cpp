#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QString>
#include <QDebug>
#include <QMessageBox>
#include <QFile>
#include <QTextStream>
#include <QIODevice>
#include "hash.h"


MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    this->uHash1 = new myUserHash1;
    this->uHash2 = new myUserHash2;
    this->nHash1 = new myNumHash1;
    this->nHash2 = new myNumHash2;
    this->q = new query;
}


MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::writeToFile(QString info){
    QFile file("info.txt");
    if(!file.open(QIODevice::Append | QIODevice::Text)){
        return;
    }
    QTextStream out(&file);
    out<<info;
    file.close();
}

void MainWindow::on_but_add_clicked()
{
    QString name = this->ui->edit_name->text();
    QString number = this->ui->edit_num->text();
    QString location = this->ui->edit_loc->text();
    if(name.length()<1||number.length()<1||location.length()<1){
        QMessageBox msgbox;
        msgbox.setInformativeText("信息不全，请补全您的信息");
        msgbox.setStandardButtons(QMessageBox::Ok |  QMessageBox::Cancel);
        msgbox.exec();
    }
    else{
        user u;
        u.username=name.toStdString();
        u.number=number.toStdString();
        u.location=location.toStdString();
        bool b1=this->uHash1->Add(u);
        bool b2=this->nHash1->Add(u);
        if(b1==false||b2==false){
            qDebug()<<b1<<" "<<b2<<endl;
            QMessageBox msgbox;
            msgbox.setInformativeText("添加失败，可能是哈希表已满或关键字重复");
            msgbox.setStandardButtons(QMessageBox::Ok |  QMessageBox::Cancel);
            msgbox.exec();
        }
        else{
            ChainNode * node=new ChainNode;
            node->u=u;
            this->uHash2->Add(node);
            this->nHash2->Add(node);
            QMessageBox msgbox;
            msgbox.setInformativeText("添加成功");
            msgbox.setStandardButtons(QMessageBox::Ok);
            msgbox.exec();

            //写入文件
            QString content = name+","+number+","+location+"\n";
            writeToFile(content);
        }
    }
    /*
    user u;
    u.username=name.toStdString();
    u.number=number.toStdString();
    u.location=location.toStdString();
    bool b1=this->uHash1->Add(u);
    bool b2=this->nHash1->Add(u);
    if(b1==false||b2==false){
        qDebug()<<b1<<" "<<b2<<endl;
        QMessageBox msgbox;
        msgbox.setInformativeText("添加失败，可能是哈希表已满或关键字重复");
        msgbox.setStandardButtons(QMessageBox::Ok |  QMessageBox::Cancel);
        msgbox.exec();
    }
    else{
        ChainNode * node=new ChainNode;
        node->u=u;
        this->uHash2->Add(node);
        this->nHash2->Add(node);
        QMessageBox msgbox;
        msgbox.setInformativeText("添加成功");
        msgbox.setStandardButtons(QMessageBox::Ok);
        msgbox.exec();

        //写入文件
        QString content = name+","+number+","+location+"\n";
        writeToFile(content);
    }*/
}

void MainWindow::on_but_find_clicked()
{
    this->q->show();
    this->q->uHash1=this->uHash1;
    this->q->uHash2=this->uHash2;
    this->q->nHash1=this->nHash1;
    this->q->nHash2=this->nHash2;
}

void MainWindow::on_but_close_clicked()
{
    this->close();
}

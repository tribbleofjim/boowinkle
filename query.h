#ifndef QUERY_H
#define QUERY_H

#include <QDialog>
#include <QStandardItemModel>
#include "hash.h"

namespace Ui {
class query;
}

class query : public QDialog
{
    Q_OBJECT

public:
    explicit query(QWidget *parent = nullptr,myUserHash1 * uHash1=nullptr,
                   myUserHash2 * uHash2=nullptr,myNumHash1 * nHash1=nullptr,
                   myNumHash2 * nHash2=nullptr);
    ~query();
    void display(int row,user u,int len);
    myUserHash1 * uHash1;
    myUserHash2 * uHash2;
    myNumHash1 * nHash1;
    myNumHash2 * nHash2;
    QStandardItemModel * model;


private slots:
    void on_btn_search_clicked();

private:
    Ui::query *ui;
};

#endif // QUERY_H

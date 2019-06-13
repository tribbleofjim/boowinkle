#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "hash.h"
#include "query.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    void writeToFile(QString info);
    myUserHash1 * uHash1;
    myUserHash2 * uHash2;
    myNumHash1 * nHash1;
    myNumHash2 * nHash2;
    query * q;

private slots:
    void on_but_add_clicked();

    void on_but_find_clicked();

    void on_but_close_clicked();

private:
    Ui::MainWindow *ui;
};

#endif // MAINWINDOW_H

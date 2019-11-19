from models import *
import json
import time
cities = ['北京', '上海', '广州', '深圳', '杭州', '长沙', '西安', '武汉', '成都', '合肥', '南京', '济南']


@app.route('/index')
def index():
    # 增
    '''
    s1 = Seat(s_num=39, c_num=3, train_num='G2046')
    db.session.add(s1)
    db.session.commit()
    '''

    # 查
    '''
    s2 = seat.query.filter(seat.s_num == 34).all()
    print(s2)
    '''
    # 改
    '''
    s3 = seat.query.filter(seat.s_num == 34).first()
    s3.c_num = 4
    db.session.commit()
    '''
    # 删
    '''
    s4 = seat.query.filter(seat.s_num == 34).first()
    db.session.delete(s4)
    db.session.commit()
    '''

    return app.send_static_file('pages/myindex.html')


# 默认为用户登录界面
@app.route('/')
def showlogin():
    return app.send_static_file('pages/login.html')


# 登录方法
@app.route('/login')
def login():
    p_num = request.args.get('p_num')
    password = request.args.get('password')
    passenger = Passenger.query.filter(Passenger.p_num == p_num, Passenger.password == password).first()
    if passenger:
        # 在这里创建一个session，把起始的start、dest和date放进来
        session['u_num'] = p_num
        session['start'] = '北京'
        session['dest'] = '上海'
        date = time.strftime('%Y-%m-%d', time.localtime())
        # print(date)
        session['date'] = date
        return app.send_static_file('pages/myindex.html')
    else:
        return "您尚未注册"


# 注册界面
@app.route('/showregiste')
def showregiste():
    return app.send_static_file('pages/registe.html')


# 注册方法
@app.route('/registe')
def registe():
    p_num = request.args.get('p_num')
    name = request.args.get('name')
    password = request.args.get('password')
    print(name)
    passenger = Passenger(p_num=p_num, name=name, password=password)
    db.session.add(passenger)
    db.session.commit()
    return app.send_static_file('pages/login.html')


# 找回界面
@app.route('/showfindpassword')
def showfindpassword():
    return app.send_static_file('pages/findpassword.html')


# 找回密码
@app.route('/findpassword')
def findpassword():
    p_num = request.args.get('p_num')
    name = request.args.get('name')
    passenger = Passenger.query.filter(Passenger.p_num == p_num, Passenger.name == name).first()
    print(passenger.password)
    return "您的密码是："+passenger.password


# 退出登录
@app.route('/unlogin')
def unlogin():
    session['p_num'] = None
    return app.send_static_file('pages/login.html')


# 从某地到某地的所有车次查询/余票查询
@app.route('/searchTickets', methods=['POST', 'GET'])
def searchtickets():
    # global start, dest # 这个地方以后要改成session存放，全局变量太笨了
    start = session.get('start')
    dest = session.get('dest')
    date = session.get('date')
    print(start, dest, date)
    # date = data.get('date')

    # 找出时刻表里同时有start和destination，并且start.arrive_time在destination.arrive_time前面的车次
    res = db.session.execute("select t1.train_num train_num,t1.arrive_time s_time,t1.place start,"
                             "t2.arrive_time d_time,t2.place dest"
                             " from time_table t1, time_table t2 "
                             "where t1.place regexp '^%s' and t2.place regexp '^%s' "
                             "and t1.arrive_time < t2.arrive_time "
                             "and t1.train_num = t2.train_num;"
                             % (start, dest))
    # print(res.fetchall())
    rows = res.rowcount  # 获取到的数据条数
    reslist = res.fetchall()  # 转成结果列表
    # print(reslist)
    # 把结果转化为列表，列表转化为json
    item = []
    d = {}
    for r in reslist:
        d['train_num'] = r[0]
        d['s_time'] = r[1]
        d['starts'] = r[2]
        d['d_time'] = r[3]
        d['dest'] = r[4]
        # print(r[0])
        # 找出所有在seat中的座位，并且它不在满足这样条件的ticket中：
        # 出发地时间小于目标目的地时间的，或是目的地时间大于目标出发地时间的
        # 这样能够保证两个时间区间没有重合
        tempres = db.session.execute("select 1 from seat"
                           " where train_num = '%s'and( "
                           " (c_num,s_num, train_num) not in ( "
                           " select c_num, s_num, t1.train_num from ticket t1, time_table t2"
                           " where t1.date = '%s' "
                           " and t1.train_num = t2.train_num "
                           " and t1.train_num = '%s' "
                           " and t1.`start` = t2.place "
                           " and t2.arrive_time < '%s') "
                           " or " 
                           " (c_num,s_num,train_num) not in ( "
                           " select c_num,s_num,t1.train_num from ticket t1, time_table t2 "
                           " where t1.date = '%s' "
                           " and t1.train_num = t2.train_num "
                           " and t1.train_num = '%s' "
                           " and t1.destination = t2.place "
                           " and t2.arrive_time > '%s'));" % (r[0], date, r[0], r[3], date, r[0], r[1]))
        db.session.commit()
        db.session.remove()
        tempreslist = tempres.fetchall()
        # print(tempreslist)
        if tempreslist:  # 该车在这个日期有票
            d['hasTicket'] = True
        else:
            d['hasTicket'] = False
        item.append(d)
        d = {}

    dic = dict()
    dic['data'] = item
    dic['total'] = rows
    dic['code'] = 0
    dic['msg'] = ''
    # print(dic)
    return json.dumps(dic, ensure_ascii=False)


# 点击查询按钮时将start和dest全局变量改为请求中发送的变量
@app.route('/change', methods=['POST', 'GET'])
def change():
    data = request.form
    session['start'] = cities[int(data.get('start'))]
    session['dest'] = cities[int(data.get('dest'))]
    session['date'] = data.get('date')
    print(session)
    return ""


# 返回车票购买页面
@app.route('/showBuyTicket', methods=['POST', 'GET'])
def showbuyticket():
    return app.send_static_file('pages/buyticket.html')


# 车票购买
@app.route('/buyTicket', methods=['POST', 'GET'])
def buyticket():
    data = request.form
    name = data.get('name')
    identity = data.get('identity')
    smartphone = data.get('smartphone')
    train_num = data.get('train_num')
    starts = data.get('starts')
    dest = data.get('dest')
    choosedate = data.get('choosedate')
    s_time = data.get('s_time')
    d_time = data.get('d_time')
    # 首先查找数据库，优先找出那些没有被任何一个时间段占据的座位
    res = db.session.execute("select c_num,s_num "
                       " from seat "
                       " where train_num = '%s' "
                       " and (c_num, s_num) not in( "
                       " select c_num, s_num "
                       " from ticket "
                       " where date = '%s' "
                       " and train_num = '%s'"
                       " );" % (train_num, choosedate, train_num))
    db.session.commit()
    db.session.remove()
    reslist = res.fetchall()
    if not reslist:
        # 如果这样的座位已经没有了，再查找那些被占用了时间段，但时间段未重叠的座位
        res = db.session.execute("select c_num,s_num from seat"
                           " where train_num = '%s'and( "
                           " (c_num,s_num, train_num) not in ( "
                           " select c_num, s_num, t1.train_num from ticket t1, time_table t2"
                           " where t1.date = '%s' "
                           " and t1.train_num = t2.train_num "
                           " and t1.train_num = '%s' "
                           " and t1.`start` = t2.place "
                           " and t2.arrive_time < '%s') "
                           " or "
                           " (c_num,s_num,train_num) not in ( "
                           " select c_num,s_num,t1.train_num from ticket t1, time_table t2 "
                           " where t1.date = '%s' "
                           " and t1.train_num = t2.train_num "
                           " and t1.train_num = '%s' "
                           " and t1.destination = t2.place "
                           " and t2.arrive_time > '%s'));" % (train_num, choosedate,
                                                             train_num, s_time, choosedate, train_num, d_time))
        db.session.commit()
        db.session.remove()
        reslist = res.fetchall()
    print(reslist)
    c_num = reslist[0][0]
    s_num = reslist[0][1]
    t = Ticket(train_num=train_num, c_num=c_num, s_num=s_num, start=starts,
               destination=dest, p_num=identity, date=choosedate, name=name, phone=smartphone, u_num=session['u_num'])
    db.session.add(t)
    db.session.commit()
    return ""


# 显示购票信息
@app.route("/showTicketInfo")
def showticketinfo():
    return app.send_static_file('pages/ticketinfo.html')


# 换乘车次
@app.route("/transferTickets")
def transferTickets():
    # global start, dest # 以后要改成session存放
    start = session['start']
    dest = session['dest']
    date = session['date']
    res = db.session.execute("select * from "
                            " (select t1.train_num train_num, t1.arrive_time arrive_time_1, "
                            " t2.arrive_time arrive_time_2, t1.place s_place, t2.place place_1 "
                            " from time_table t1, time_table t2 "
                            " where t1.train_num = t2.train_num "
                            " and t1.place != t2.place "
                            " and t1.place regexp '^%s') t3, "
                            " (select t1.train_num train_num_1, t1.arrive_time arrive_time_3, "
                            " t2.arrive_time arrive_time_4, t1.place d_place, t2.place place_2 "
                            " from time_table t1, time_table t2 "
                            " where t1.train_num = t2.train_num "
                            " and t1.place != t2.place "
                            " and t1.place regexp '^%s') t4 "
                            " where arrive_time_1 < arrive_time_2 "
                            " and arrive_time_2 < arrive_time_4 "
                            " and arrive_time_4 < arrive_time_3 and place_1 = place_2; " % (start, dest))
    rows = res.rowcount
    reslist = res.fetchall()
    print(reslist)
    item = []
    d = {}
    # 把返回的每一行数据拆成两条显示
    for r in reslist:
        # 换乘的第一辆车
        d['train_num'] = r[0]
        d['s_time'] = r[1]
        d['starts'] = r[3]
        d['d_time'] = r[2]
        d['dest'] = r[4]
        tempres = db.session.execute("select 1 from seat"
                                     " where train_num = '%s'and( "
                                     " (c_num,s_num, train_num) not in ( "
                                     " select c_num, s_num, t1.train_num from ticket t1, time_table t2"
                                     " where t1.date = '%s' "
                                     " and t1.train_num = t2.train_num "
                                     " and t1.train_num = '%s' "
                                     " and t1.`start` = t2.place "
                                     " and t2.arrive_time < '%s') "
                                     " or "
                                     " (c_num,s_num,train_num) not in ( "
                                     " select c_num,s_num,t1.train_num from ticket t1, time_table t2 "
                                     " where t1.date = '%s' "
                                     " and t1.train_num = t2.train_num "
                                     " and t1.train_num = '%s' "
                                     " and t1.destination = t2.place "
                                     " and t2.arrive_time > '%s'));" % (r[0], date, r[0], r[2], date, r[0], r[1]))
        db.session.commit()
        db.session.remove()
        tempreslist = tempres.fetchall()
        if tempreslist:  # 该车在这个日期有票
            d['hasTicket'] = True
        else:
            d['hasTicket'] = False
        item.append(d)
        d = {}
        # 换乘的第二辆车
        d['train_num'] = r[5]
        d['s_time'] = r[7]
        d['starts'] = r[9]
        d['d_time'] = r[6]
        d['dest'] = r[8]
        tempres = db.session.execute("select 1 from seat"
                                     " where train_num = '%s'and( "
                                     " (c_num,s_num, train_num) not in ( "
                                     " select c_num, s_num, t1.train_num from ticket t1, time_table t2"
                                     " where t1.date = '%s' "
                                     " and t1.train_num = t2.train_num "
                                     " and t1.train_num = '%s' "
                                     " and t1.`start` = t2.place "
                                     " and t2.arrive_time < '%s') "
                                     " or "
                                     " (c_num,s_num,train_num) not in ( "
                                     " select c_num,s_num,t1.train_num from ticket t1, time_table t2 "
                                     " where t1.date = '%s' "
                                     " and t1.train_num = t2.train_num "
                                     " and t1.train_num = '%s' "
                                     " and t1.destination = t2.place "
                                     " and t2.arrive_time > '%s'));" % (r[5], date, r[5], r[6], date, r[5], r[7]))
        db.session.commit()
        db.session.remove()
        tempreslist = tempres.fetchall()
        if tempreslist:  # 该车在这个日期有票
            d['hasTicket'] = True
        else:
            d['hasTicket'] = False
        item.append(d)
        d = {}
    dic = dict()
    dic['data'] = item
    dic['total'] = rows * 2
    dic['code'] = 0
    dic['msg'] = ''
    # print(dic)
    return json.dumps(dic, ensure_ascii=False)


# 转到主页时，向前端发送用户名
@app.route('/getUser')
def getuser():
    u = dict()
    if 'u_num' in session:
        u_num = session['u_num']
        user = Passenger.query.filter(Passenger.p_num == u_num).first()
        u['username'] = user.name
        return json.dumps(u, ensure_ascii=False)
    else:
        return "nologin"


# 向前端发送用户所有信息（用在个人中心）
@app.route('/getAllAboutUser')
def getallaboutuser():
    if 'u_num' in session:
        u_num = session['u_num']
        user = Passenger.query.filter(Passenger.p_num == u_num).first()
        u = dict()
        u['u_num'] = user.p_num
        u['username'] = user.name
        u['password'] = user.password
        return json.dumps(u, ensure_ascii=False)
    else:
        return "nologin"


# 显示订单管理页面
@app.route('/showManageOrders')
def showmanageorders():
    return app.send_static_file('pages/manageorders.html')


# 单个用户的订单管理
@app.route('/manageOrders')
def manageorders():
    u_num = session['u_num']
    res = Ticket.query.filter(Ticket.u_num == u_num).all()
    rows = len(res)
    print(res)
    item = []
    d = {}
    for ticket in res:
        d['date'] = str(ticket.date)
        d['train_num'] = ticket.train_num
        d['c_num'] = ticket.c_num
        d['s_num'] = ticket.s_num
        d['starts'] = ticket.start
        d['dest'] = ticket.destination
        d['name'] = ticket.name
        d['p_num'] = ticket.p_num
        d['phone'] = ticket.phone
        item.append(d)
        d = {}
    dic = dict()
    dic['data'] = item
    dic['total'] = rows
    dic['code'] = 0
    dic['msg'] = ''
    return json.dumps(dic, ensure_ascii=False)


# 退票请求
@app.route('/refund', methods=['POST'])
def refund():
    data = request.form
    strdata = data.get('strData')
    # print(strdata)
    strdata = strdata.replace('{', '')
    strdata = strdata.replace('}', '')
    strdata = strdata.replace('"', '')
    strdata = strdata.split(',')
    date = strdata[0].split(':')[1]
    train_num = strdata[1].split(':')[1]
    c_num = strdata[2].split(':')[1]
    s_num = strdata[3].split(':')[1]
    starts = strdata[4].split(':')[1]
    dest = strdata[5].split(':')[1]
    name = strdata[6].split(':')[1]
    # print(date, train_num, c_num, s_num, starts, dest, name)
    t = Ticket.query.filter(Ticket.date == date, Ticket.train_num == train_num, Ticket.c_num == c_num,
                Ticket.s_num == s_num, Ticket.start == starts, Ticket.destination == dest, Ticket.name == name).first()
    db.session.delete(t)
    db.session.commit()
    return ""


# 改签请求
@app.route("/changeTicket", methods=['POST'])
def changeticket():
    data = request.form
    strdata = data.get('strData')
    strdata = strdata.replace('{', '')
    strdata = strdata.replace('}', '')
    strdata = strdata.replace('"', '')
    strdata = strdata.split(',')
    date = strdata[0].split(':')[1]
    train_num = strdata[1].split(':')[1]
    c_num = strdata[2].split(':')[1]
    s_num = strdata[3].split(':')[1]
    starts = strdata[4].split(':')[1]
    dest = strdata[5].split(':')[1]
    name = strdata[6].split(':')[1]
    session['start'] = starts
    session['dest'] = dest
    print(starts, dest)
    # 退票
    t = Ticket.query.filter(Ticket.date == date, Ticket.train_num == train_num, Ticket.c_num == c_num,
                            Ticket.s_num == s_num, Ticket.start == starts, Ticket.destination == dest,
                            Ticket.name == name).first()
    db.session.delete(t)
    db.session.commit()
    return ""


# 返回个人中心界面
@app.route("/manageUser")
def manageuser():
    return app.send_static_file('pages/manageuser.html')


# 进入车次管理界面
@app.route('/manageTrains')
def managetrains():
    return app.send_static_file('pages/managetrains.html')


# 进入坐席管理界面
@app.route('/manageSeats')
def manageseats():
    return app.send_static_file('pages/manageseats.html')


# 进入用户管理界面
@app.route('/manageUsers')
def manageusers():
    return app.send_static_file('pages/manageusers.html')


# 显示列车车次信息
@app.route('/Trains')
def trains():
    res = db.session.execute("select t1.train_num train_num, t1.place stat, t1.arrive_time s_time,"
                             "t2.place dest, t2.arrive_time d_time"
                            " from " 
                            " (select train_num, place, arrive_time from time_table "
                            "where arrive_time = leave_time) t1, "
                            "(select train_num, place, arrive_time from time_table"
                            " where arrive_time = leave_time) t2 "
                            " where t1.arrive_time < t2.arrive_time"
                            " and t1.train_num = t2.train_num;")
    rows = res.rowcount
    reslist = res.fetchall()
    # 把结果转化为列表，列表转化为json
    item = []
    d = {}
    for r in reslist:
        d['train_num'] = r[0]
        d['starts'] = r[1]
        d['s_time'] = r[2]
        d['dest'] = r[3]
        d['d_time'] = r[4]
        item.append(d)
        d = {}
    dic = dict()
    dic['data'] = item
    dic['total'] = rows
    dic['code'] = 0
    dic['msg'] = ''

    return json.dumps(dic, ensure_ascii=False)


# 显示所有列车时刻表
@app.route('/Time_tables')
def time_tables():
    res = db.session.execute("select * from time_table ;")
    rows = res.rowcount  # 获取到的数据条数
    reslist = res.fetchall()  # 转成结果列表
    # 把结果转化为列表，列表转化为json
    item = []
    d = {}
    for r in reslist:
        d['train_num'] = r[0]
        d['arrive_time'] = r[1]
        d['leave_time'] = r[2]
        d['place'] = r[3]
        item.append(d)
        d = {}
    dic = dict()
    dic['data'] = item
    dic['total'] = rows
    dic['code'] = 0
    dic['msg'] = ''
    return json.dumps(dic, ensure_ascii=False)


# 显示坐席信息
@app.route('/Seats')
def seats():
    res = db.session.execute(" select * from seat ; ")
    reslist = res.fetchall()  # 转成结果列表
    rows = res.rowcount
    # 把结果转化为列表，列表转化为json
    item = []
    d = {}
    for r in reslist:
        d['s_num'] = r[0]
        d['c_num'] = r[1]
        d['train_num'] = r[2]
        item.append(d)
        d = {}
    dic = dict()
    dic['data'] = item
    dic['total'] = rows
    dic['code'] = 0
    dic['msg'] = ''
    return json.dumps(dic, ensure_ascii=False)


# 显示用户信息
@app.route('/Users')
def users():
    res = db.session.execute("select * from passenger; ")
    reslist = res.fetchall()  # 转成结果列表
    rows = res.rowcount
    print(reslist)
    # 把结果转化为列表，列表转化为json
    item = []
    d = {}
    for r in reslist:
        d['u_num'] = r[0]
        d['name'] = r[1]
        d['password'] = r[3]
        item.append(d)
        d = {}
    dic = dict()
    dic['data'] = item
    dic['total'] = rows
    dic['code'] = 0
    dic['msg'] = ''
    return json.dumps(dic, ensure_ascii=False)


# 从用户信息界面修改密码
@app.route('/pages/changePassword')
def changepassword():
    old_password = request.args.get('old_password')
    new_password = request.args.get('new_password')
    if 'u_num' in session:
        u_num = session['u_num']
        p = Passenger.query.filter(Passenger.p_num == u_num).first()
        if p.password == old_password:
            p.password = new_password
            db.session.commit()
            return "修改密码成功！"
        else:
            return "旧密码错误！"
    else:
        return "您尚未登录！"


# 添加车次信息
@app.route('/pages/addTrain')
def addtrain():
    train_num = request.args.get('train_num')
    s_time = request.args.get('s_time')
    d_time = request.args.get('d_time')
    place = request.args.get('place')
    t1 = TimeTable(train_num=train_num, arrive_time=d_time, leave_time=s_time, place=place)
    db.session.add(t1)
    db.session.commit()
    return "添加成功！"


# 删除车次信息
@app.route('/deleteTrain', methods=['POST'])
def deletetrain():
    strdata = request.form.get('data')
    strdata = strdata.replace('{', '')
    strdata = strdata.replace('}', '')
    strdata = strdata.replace('"', '')
    strdata = strdata.split(',')
    train_num = strdata[0].split(':')[1]
    arrive_time = strdata[1].split(':')[1] + ':' + strdata[1].split(':')[2]
    leave_time = strdata[2].split(':')[1] + ':'+ strdata[2].split(':')[2]
    place = strdata[3].split(':')[1]
    print(train_num, arrive_time, leave_time, place)
    tr = TimeTable.query.filter(TimeTable.train_num == train_num, TimeTable.arrive_time == arrive_time,
                                TimeTable.place == place, TimeTable.leave_time == leave_time).first()
    db.session.delete(tr)
    db.session.commit()
    return ""


# 删除用户
@app.route('/deleteUser', methods=['POST'])
def deleteuser():
    strdata = request.form.get('strData')
    strdata = strdata.replace('{', '')
    strdata = strdata.replace('}', '')
    strdata = strdata.replace('"', '')
    strdata = strdata.split(',')
    id = strdata[0].split(':')[1]
    p = Passenger.query.filter(Passenger.p_num == id).first()
    db.session.delete(p)
    db.session.commit()
    return ""


# 添加座位信息
@app.route('/pages/addSeat')
def addseat():
    train_num = request.args.get('train_num')
    c_num = request.args.get('c_num')
    s_num = request.args.get('s_num')
    s1 = Seat(train_num=train_num, c_num=c_num, s_num=s_num)
    db.session.add(s1)
    db.session.commit()
    return "添加成功！"


# 删除座位信息
@app.route('/deleteSeat', methods=['POST'])
def deleteseat():
    strdata = request.form.get('data')
    strdata = strdata.replace('{', '')
    strdata = strdata.replace('}', '')
    strdata = strdata.replace('"', '')
    strdata = strdata.split(',')
    train_num = strdata[2].split(':')[1]
    c_num = strdata[1].split(':')[1]
    s_num = strdata[0].split(':')[1]
    s1 = Seat.query.filter(Seat.train_num == train_num, Seat.c_num == c_num, Seat.s_num == s_num).first()
    db.session.delete(s1)
    db.session.commit()
    return ""


if __name__ == '__main__':
    app.run()

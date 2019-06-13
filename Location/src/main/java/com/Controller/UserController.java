package com.Controller;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List; 

import com.Model.Chat;
import com.Model.User;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;

public class UserController extends Controller{
	public void index() {
		render("/production/login.html");
	}
	
	//小程序端登录
	public void login() {
		String userID = getPara("nickname");
		System.out.println("this is userid:"+userID);
		User u = User.dao.findFirst("select userID from User where userID = ?",userID);
		if(u == null) {
			new User().set("userID", userID).save();
		}
		renderText("success");
	}
	
	//后台网站用户登录
	public void Login() {
		String userID = getPara("userID");
		String password = getPara("password");
		//System.out.println("userID:"+userID+" password:"+password);
		if(userID != null && password != null) {
			render("/production/myMap.html");
		}
		render("/production/myMap.html");
	}
	
	//用户注册
	public void register() {
		String username = getPara("username");
		String password = getPara("password");
		String isAdmin = getPara("admin");
		int b = isAdmin.equals("true")? 1:0;
		new User().set("userID", username).set("password", password).set("isAdmin",b).save();
		render("/production/UserInfo.html");
	}
	
	//用户注销
	public void removeUser() {
		String userID = getPara("userID");
		Db.delete("delete from user where userID = ?",userID);
		render("/production/UserInfo.html");
	}
	
	//用户信息更新
	public void updateUser() {
		String userID = getPara("userID");
		String password = getPara("password");
		String isAdmin = getPara("isAdmin");
		int b = isAdmin.equals("yes")? 1:0;
		Db.update("update user set password=?,isAdmin=? where userID = ?",password,b,userID);
		renderText("success");
	}
	
	//发送聊天信息
	public void ChatSend() {
		String text = getPara("content");
		String sender = getPara("sender");
		String getter = getPara("getter");
		System.out.println("this is content:"+text);
		new Chat().set("sendID",sender).set("getID", getter).set("content", text).save();
		renderText("success");
	}
	
	//聊天内容显示
	public void Chat() {
		String sender = getPara("sender");
		String getter = getPara("getter");
		List<Chat> c = Chat.dao.find("select * from Chat where sendID = ? and getID = ? "
				+ "or getID = ? and sendID = ?  order by time",sender,getter,sender,getter);
		setAttr("chat",c);
		renderJson();
	}
	
	//发送位置信息
	public void LocSend() {
		String longitude = getPara("longitude");
		String latitude = getPara("latitude");
		String sender = getPara("sender");
		String getter = getPara("getter");
		System.out.println("lo:"+longitude+" la:"+latitude);
		String location = "longitude:"+longitude+" latitude:"+latitude;
		new Chat().set("sendID", sender).set("getID",getter)
			.set("content", location).set("isLocation",true).save();
		renderText("success");
	}
	
	//后台用户信息
	public void userinfo() {
		render("/production/UserInfo.html");
	}
	
	//datagrid的user信息显示
	public void getUsers() {
		List<User> users = User.dao.find("select * from User");
		setAttr("rows",users);
		setAttr("total",users.size());
		renderJson();
	}
	
	//后台聊天信息
	public void chatinfo() {
		render("/production/ChatInfo.html");
	}
	
	//datagrid聊天信息显示
	public void getChats() {
		List<Chat> chats = Chat.dao.find("select * from Chat");
		//System.out.println(chats);
		setAttr("rows",chats);
		setAttr("total",chats.size());
		renderJson();
	}
	
	//后台删除聊天记录
	public void removeChat() {
		String sendID = getPara("sendID");
		String time = getPara("time");
		//Date time = getParaToDate("time");
		//Timestamp ts = new Timestamp(time.getTime());
		Db.delete("delete from chat where sendID = ? and time = ?",sendID,time);
		render("/production/ChatInfo.html");
	}
	
	//后台更新聊天记录
	public void updateChat() {
		String sendID = getPara("sendID");
		String time = getPara("time");
		//Date time = getParaToDate("time");
		//Timestamp ts = new Timestamp(time.getTime());
		String content = getPara("content");
		Db.update("update chat set content = ? where sendID = ? and time = ?",content,sendID,time);
		renderText("success");
	}
	
	//后台插入聊天记录
	public void Record() {
		String sendID = getPara("sendID");
		String getID = getPara("getID");
		String content = getPara("content");
		String isLocation = getPara("isLocation");
		int b = isLocation.equals("yes")? 1:0;
		new Chat().set("sendID", sendID).set("getID", getID).set("isLocation", b).set("content", content).save();
		render("/production/ChatInfo.html");
	}
}

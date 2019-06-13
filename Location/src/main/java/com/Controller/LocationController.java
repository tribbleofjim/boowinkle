package com.Controller;

import java.util.Date;
import java.util.List;

import com.Model.Location;

import com.jfinal.core.Controller;

public class LocationController extends Controller{
	public void index() {
		render("/production/DataHist.html");
	}
	
	//获取轨迹
	public void getTrack() {
		List<Location> lola = Location.dao.find("select longitude,latitude from Location where username=?","琥珀川");
		List<Location> time = Location.dao.find("select create_time from Location where username=?","琥珀川");
		setAttr("points",lola);
		setAttr("pointsInfos",time);
		renderJson();
	}
	
	//后台获取数据轨迹
	public void Track() {
		if(getPara("username") != null && getPara("username") != "") {
			String username = getPara("username");
			List<Location> locations = Location.dao.find("select * from Location where username=?",username);
			setAttr("rows",locations);
			setAttr("total",locations.size());
			renderJson();
		}
		
		else {
			List<Location> locations = Location.dao.find("select * from Location");
			setAttr("rows",locations);
			setAttr("total",locations.size());
			renderJson();
		}
		
	}
	
	//跳转到图片网页
	public void map() {
		render("/production/MapHist.html");
	}
	
	//获取当前各用户的位置信息
	public void getLocations() {
		List<Location> l1 = Location.dao.find("select * from location");
		List<Location> l2 = Location.dao.find("select distinct username from location");
		//找出每个用户当前最晚时间所在的位置
		//name是用户名
		String name;
		//k留存每轮循环里时间最大的那条记录
		int k = 0;
		Date d = l1.get(0).getCreateTime();
		//locs留存最后的结果
		List<Location> locs = l2;
		for(int i=0;i<l2.size();i++) {
			name = l2.get(i).getUsername();
			
			for(int j=0;j<l1.size();j++) {
				if(l1.get(j).getUsername().equals(name)) {
					//找出最大时间
					if(l1.get(j).getCreateTime().compareTo(d)>0) {
						d = l1.get(j).getCreateTime();
						k = j;
					}
				}
			}
			locs.set(i, l1.get(k));
		}
		setAttr("points",locs);
		renderJson();
	}
	
}

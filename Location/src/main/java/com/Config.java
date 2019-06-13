package com;

import com.Controller.LocationController;
import com.Controller.UserController;
import com.Model._MappingKit;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.kit.Prop;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.c3p0.C3p0Plugin;
import com.jfinal.server.undertow.UndertowServer;
import com.jfinal.template.Engine;

public class Config extends JFinalConfig{
	static Prop p;
	
	public static void main(String args[]) {
		UndertowServer.start(Config.class, 81, true);
	}

	static void loadConfig() {
		if (p == null) {
			p = PropKit.use("config.properties");
		}
	}
	
	@Override
	public void configConstant(Constants me) {
		// TODO Auto-generated method stub
		me.setDevMode(true);
		PropKit.use("config.properties");
	}

	@Override
	public void configRoute(Routes me) {
		// TODO Auto-generated method stub
		me.add("/Location",LocationController.class);
		me.add("/User",UserController.class);
	}

	@Override
	public void configEngine(Engine me) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void configPlugin(Plugins me) {
		// TODO Auto-generated method stub
		C3p0Plugin c3p0Plugin = new C3p0Plugin(PropKit.get("jdbcUrl"),PropKit.get("user"),PropKit.get("password"));
	       
        ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0Plugin);
        arp.setShowSql(true);
        _MappingKit.mapping(arp);//使用mappingkit实现加载
        me.add(c3p0Plugin);
        me.add(arp);
	}
	
	//通过generator来同步类与model
	public static C3p0Plugin createC3p0Plugin() {
		loadConfig();
		
		return new C3p0Plugin(p.get("jdbcUrl"), p.get("user"), p.get("password").trim());
	}

	@Override
	public void configInterceptor(Interceptors me) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void configHandler(Handlers me) {
		// TODO Auto-generated method stub
		
	}
	

}

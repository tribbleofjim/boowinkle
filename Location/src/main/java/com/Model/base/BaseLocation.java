package com.Model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseLocation<M extends BaseLocation<M>> extends Model<M> implements IBean {

	public void setLongitude(java.math.BigDecimal longitude) {
		set("longitude", longitude);
	}
	
	public java.math.BigDecimal getLongitude() {
		return get("longitude");
	}

	public void setLatitude(java.math.BigDecimal latitude) {
		set("latitude", latitude);
	}
	
	public java.math.BigDecimal getLatitude() {
		return get("latitude");
	}

	public void setKey(java.lang.Integer key) {
		set("key", key);
	}
	
	public java.lang.Integer getKey() {
		return getInt("key");
	}

	public void setCreateTime(java.util.Date createTime) {
		set("create_time", createTime);
	}
	
	public java.util.Date getCreateTime() {
		return get("create_time");
	}

	public void setUsername(java.lang.String username) {
		set("username", username);
	}
	
	public java.lang.String getUsername() {
		return getStr("username");
	}

}
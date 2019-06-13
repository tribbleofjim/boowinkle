package com.util;

import javax.sql.DataSource;

import com.Config;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.dialect.MysqlDialect;
import com.jfinal.plugin.activerecord.generator.Generator;
import com.jfinal.plugin.c3p0.C3p0Plugin;

public class _ModelGenerator {
	public static DataSource getDataSource() {
	    C3p0Plugin c3p0Plugin = Config.createC3p0Plugin();
		c3p0Plugin.start();
		return c3p0Plugin.getDataSource();
	}
	
	public static void main(String args[]) {
		// base model ��ʹ�õİ���
		String baseModelPackageName = "com.Model.base";
		// base model �ļ�����·��
		String baseModelOutputDir = PathKit.getWebRootPath() + "/src/main/java/com/Model/base";
		
		// model ��ʹ�õİ��� (MappingKit Ĭ��ʹ�õİ���)
		String modelPackageName = "com.Model";
		// model �ļ�����·�� (MappingKit �� DataDictionary �ļ�Ĭ�ϱ���·��)
		String modelOutputDir = baseModelOutputDir + "/..";
		
		// ����������
		Generator generator = new Generator(getDataSource(), baseModelPackageName, baseModelOutputDir, modelPackageName, modelOutputDir);
		
		// �����Ƿ����ɱ�ע
		generator.setGenerateRemarks(true);
		
		// �������ݿⷽ��
		generator.setDialect(new MysqlDialect());
		
		// �����Ƿ�������ʽ setter ����
		generator.setGenerateChainSetter(false);
		
		// ��Ӳ���Ҫ���ɵı���
		generator.addExcludedTable("adv");
		
		// �����Ƿ��� Model ������ dao ����
		generator.setGenerateDaoInModel(false);
		
		// �����Ƿ������ֵ��ļ�
		generator.setGenerateDataDictionary(false);
		
		// ������Ҫ���Ƴ��ı���ǰ׺��������modelName��������� "osc_user"���Ƴ�ǰ׺ "osc_"�����ɵ�model��Ϊ "User"���� OscUser
		generator.setRemovedTableNamePrefixes("t_");
		
		// ����
		generator.generate();
	}
}

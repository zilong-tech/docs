---
title: Mybatis查询数据部分字段显示为null,转换成”“
author: 程序员子龙
index: true
icon: discover
category:
- MySQL

---
先定义hander

```java

import org.apache.ibatis.executor.result.ResultMapException;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


@MappedTypes({String.class})
@MappedJdbcTypes(JdbcType.VARCHAR)
public class CustomStringTypeHandler extends BaseTypeHandler<String> {


    @Override
    public String getResult(ResultSet rs, String columnName) {
        String result;
        try {
            result = getNullableResult(rs, columnName);
        } catch (Exception e) {
            throw new ResultMapException("Error attempting to get column '" + columnName + "' from result set.  Cause: " + e, e);
        }
        return result;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType)
            throws SQLException {
        ps.setString(i, parameter);
    }

    @Override
    public String getNullableResult(ResultSet rs, String columnName)
            throws SQLException {
        return rs.getString(columnName) == null? "" : rs.getString(columnName);
    }

    @Override
    public String getNullableResult(ResultSet rs, int columnIndex)
            throws SQLException {
        return rs.getString(columnIndex) == null? "" : rs.getString(columnIndex);
    }

    @Override
    public String getNullableResult(CallableStatement cs, int columnIndex)
            throws SQLException {
        return cs.getString(columnIndex) == null? "" : cs.getString(columnIndex);
    }
}

```

2、在Mapper.xml中，把可能为空的字段，加上typeHandler属性，指定处理的handler类的全路径。

```xml
    <result column="REASON" jdbcType="VARCHAR" property="reason" typeHandler="xxxx.CustomStringTypeHandler"/> 
```


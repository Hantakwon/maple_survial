<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>회원가입</title>
</head>
<body>
	<h1>회원가입</h1>
	
	<!-- 오류 메시지 표시 -->
    <c:if test="${not empty errorMessage}">
        <p style="color: red;">${errorMessage}</p>
    </c:if>
	
	<form action="/signup.do" method="POST">
		<label for="id">아이디:</label> 
		<input type="text" id="id"name="id" required> 
		<br>
		<label for="password">비밀번호:</label> 
		<input type="password" id="password" name="password" required>
		<br>

		<button type="submit">회원가입</button>
	</form>
</body>
</html>
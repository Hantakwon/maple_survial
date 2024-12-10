<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="/resources/css/home.css">
</head>
<body>
	<div id="container">
		<h1>안녕하세요 ${userDO.id} 님</h1>
		<button type="button" onclick="location.href='start.do'">게임
			시작</button>
		<button type="button" onclick="location.href='monster.do'">몬스터
			도감</button>
		<button type="button" onclick="location.href='logout.do'">로그
			아웃</button>

		<h1>${userDO.id} 직업별 최고점수</h1>
		<hr>
		<div id="scoreContainer">
			<div class="character">
				<h2>전사</h2>
				<ul>
					<c:forEach var="score" items="${warrior}" varStatus="status">
						<li>${status.index + 1}위.${score.score}점</li>
					</c:forEach>
				</ul>
			</div>
			<div class="character">
				<h2>법사</h2>
				<ul>
					<c:forEach var="score" items="${magician}" varStatus="status">
						<li>${status.index + 1}위.${score.score}점</li>
					</c:forEach>
				</ul>
			</div>
			<div class="character">
				<h2>궁수</h2>
				<ul>
					<c:forEach var="score" items="${archer}" varStatus="status">
						<li>${status.index + 1}위.${score.score}점</li>
					</c:forEach>
				</ul>
			</div>
			<div class="character">
				<h2>도적</h2>
				<ul>
					<c:forEach var="score" items="${thief}" varStatus="status">
						<li>${status.index + 1}위.${score.score}점</li>
					</c:forEach>
				</ul>
			</div>
		</div>
	</div>
</body>
</html>
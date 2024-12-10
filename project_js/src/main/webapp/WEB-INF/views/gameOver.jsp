<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="/resources/css/gameOver.css">
<script type="text/javascript">
	// 서버에서 전달된 characterData 값을 JavaScript 변수로 저장
	const characterName = "${characterName}"; // JSP에서 전달된 characterData 값
</script>
</head>
<body>
	<div id="container">
		<div id="imgConatainer">
			<img id="character-image" src="" alt="Character Image">
		</div>

		<div id="infoContainer">
			<p>${userDO.id}</p>
			<p>당신의 직업 : ${characterName}</p>
			<p>당신의 점수 : ${score}</p>
			
			<button type="button" onclick="location.href='home.do'">시작화면으로</button>
		</div>
	</div>
	
	<script type="text/javascript" src="/resources/js/gameOver.js"></script>
	
</body>
</html>
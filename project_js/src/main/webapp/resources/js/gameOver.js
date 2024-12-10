let character;

async function fetchCharacterInfo(characterName) {
	try {
		const response = await fetch('http://127.0.0.1:8000/character/info');
		const data = await response.json();

		console.log('Received data:', data); // 데이터 로깅 추가

		if (data.error) {
			alert(data.error);
			return;
		}

		// 캐릭터 이름을 객체로 정의
		const characters = {
			warrior: data['전사'],
			archer: data['궁수'],
			magician: data['법사'],
			thief: data['도적']
		};

		if (characterName === '전사') {
			character = characters.warrior;
		} else if (characterName == '궁수') {
			character = characters.archer;
		} else if (characterName == '법사') {
			character = characters.magician;
		} else if (characterName == '도적') {
			character = characters.thief;
		}
		
		console.log(character);

		const characterImage = document.querySelector('#character-image');

		characterImage.src = character.image;
		characterImage.alt = character.name;

	} catch (error) {
		console.error('Error fetching character info:', error);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	console.log(characterName);
	fetchCharacterInfo(characterName); // JSP에서 전달된 characterName으로 이미지 설정
});

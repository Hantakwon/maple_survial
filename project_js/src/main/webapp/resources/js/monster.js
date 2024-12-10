async function fetchMonsterData() {
    try {
        // 몬스터 데이터 가져오기
        const monsterResponse = await fetch(`http://127.0.0.1:8000/monster/info`);
        const monsterData = await monsterResponse.json(); // 객체 형식으로 저장

        console.log(monsterData); // 응답 데이터 확인

        // 객체를 배열로 변환
        const monsters = Object.values(monsterData);

        // #container에 데이터를 렌더링
        const container = document.getElementById('container');
        container.innerHTML = ''; // 기존 내용 초기화

        // 각 몬스터 데이터를 반복 렌더링 (6개 제한)
        monsters.forEach(monster => {
            const monsterDiv = document.createElement('div');
            monsterDiv.classList.add('monster');

            // 몬스터 이름과 설명을 추가
            monsterDiv.innerHTML = `
				<img src="${monster.image}" alt="${monster.name}" class="monster-image">
                <h2>${monster.name}</h2>
                <p>HP: ${monster.hp}</p>
                <p>EXP: ${monster.exp}</p>
                <p>Speed: ${monster.speed}</p>
                <p class="description">${monster.description || 'No description available'}</p>
            `;

            container.appendChild(monsterDiv); // container에 추가
        });
    } catch (error) {
        console.error('Error fetching monster data:', error);
    }
}

fetchMonsterData();

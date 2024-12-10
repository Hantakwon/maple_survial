// Game 요소 가져오기
const game = document.querySelector("#game");
const characterImg = document.querySelector("#character");
const hitbox = document.querySelector("#hitbox");
const hpDiv = document.querySelector("#hp");
const levelDiv = document.querySelector("#level");
const scoreDiv = document.querySelector("#score");

// 전역에서 써야되는 변수들
// 이미지
let stand_img = "";
let walk_img = "";
let atk_img = "";
let heal_img = "";

// 이미지 위치 자료
let center_offset_x = 0;
let center_offset_y = 0;
const gameRect = game.getBoundingClientRect();

console.log(gameRect);

const position = { x: gameRect.width / 2, y: gameRect.height / 2 }; // 초기 위치

// 이미지 결정 boolean 값
let isAtkMode = false;
let isMoving = false;
let isFacingRight = false; // 캐릭터가 오른쪽을 보고 있는 상태
let isGameOver = false;
let currentState = "stand";

// 키보드 입력
const keysPressed = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

// 캐릭터 정보
let character;
let prevHp, prevAtk, prevSpeed, prevLevel, prevScore, prevExperience; // 상태 값 변화 감지 저장
let maxHp, hp, atk, speed; // 체력, 공격력, 속도
let level = 1; // 레벨
let experience = 0; // 경험치
let score = 0; // 점수
let canTakeDamage = true;
let atkBox;

// 몬스터 정보
let monsters = []; // 몬스터들을 저장할 배열

// 게임 정보
let isLevelUp = false; // 레벨업 상태

// API 호출 및 데이터 가져오기
async function fetchCharacterStatus(characterName) {
	try {
		const characterResponse = await fetch(`http://127.0.0.1:8000/character/status/${characterName}`);
		const characterData = await characterResponse.json();

		const monsterResponse = await fetch(`http://127.0.0.1:8000/monster/info`);
		const monsterData = await monsterResponse.json();

		console.log(characterData);
		console.log(monsterData);

		if (characterData.error || monsterData.error) {
			alert(characterData.error);
			return;
		}

		setGameData(characterData);
		setCharacter(characterData);
		setHitbox(characterData);
		try {
			// 5초마다 spawnMonster 실행
			monsterSpawnInterval = setInterval(() => {
				spawnMonster(monsterData);
			}, 5000); // 5000ms = 5초
		} catch (error) {
			console.error("Error starting monster spawning:", error);
		}

	} catch (error) {
		console.error('Error fetching character status:', error);
	}
}

// ------------- < Game 데이터 설정 > ---------------------

// 게임 기본 데이터 설정
function setGameData(characterData) {
	hp = parseInt(characterData.hp);
	maxHp = hp;
	atk = parseInt(characterData.atk);
	speed = parseInt(characterData.speed);

	updateGameData();
}

function updateGameData() {
	if (hp !== prevHp || atk !== prevAtk || speed !== prevSpeed) {
	    // 기존 내용을 초기화
	    hpDiv.innerHTML = '';

	    // 컨테이너 스타일 설정
	    hpDiv.style.display = 'flex';
	    hpDiv.style.flexDirection = 'column';
	    hpDiv.style.justifyContent = 'space-between';
	    hpDiv.style.alignItems = 'center'; // 가운데 정렬

	    // 위쪽 50%: HP 이미지 추가
	    const imageContainer = document.createElement('div');
	    imageContainer.style.flex = '2'; // 상단 50% 영역
	    imageContainer.style.display = 'flex';
	    imageContainer.style.justifyContent = 'center';
	    imageContainer.style.alignItems = 'center';

	    for (let i = 0; i < hp; i++) {
	        const img = document.createElement('img');
	        img.src = '/resources/images/hp.png';
	        img.alt = 'HP';
	        img.style.width = '16px'; // 이미지 크기 조정 (옵션)
	        img.style.height = '16px'; // 이미지 크기 조정 (옵션)
	        imageContainer.appendChild(img);
	    }

	    // 아래쪽 50%: atk와 speed 정보 추가
	    const infoDiv = document.createElement('div');
	    infoDiv.style.flex = '1'; // 하단 50% 영역
	    infoDiv.style.display = 'flex';
	    infoDiv.style.justifyContent = 'center';
	    infoDiv.style.alignItems = 'center';
	    infoDiv.innerHTML = `atk : ${atk} speed : ${speed}`;

	    // 컨테이너에 추가
	    hpDiv.appendChild(imageContainer);
	    hpDiv.appendChild(infoDiv);

	    // 상태 값 업데이트
	    prevHp = hp;
	    prevAtk = atk;
	    prevSpeed = speed;
	}
	if (level !== prevLevel || experience !== prevExperience) {
		levelDiv.innerHTML = `LEVEL : ${level} <br> EXP : ${experience}`;
		prevLevel = level;
		prevExperience = experience;
	}
	if (score !== prevScore) {
		scoreDiv.innerText = `SCORE : ${score}`;
		prevScore = score;
	}
}

// 게임 루프
function startGame() {
	if (isLevelUp) return;
	moveCharacter(); // 캐릭터 이동 업데이트

	// 몬스터 움직임 및 충돌 감지
	monsters.forEach((monster) => {
		moveMonster(monster); // 몬스터 이동
		checkCollision(monster); // 충돌 감지
	});

	// moveMonster(monster);
	// checkCollision(monster);

	updateGameData(); // 게임 상태 업데이트
	requestAnimationFrame(startGame); // 다음 프레임 요청
}

// 게임 오버 처리
function gameOver() {
	cancelAnimationFrame(startGame);
	alert("Game Over!");
	window.location.href = `gameOver.do?score=${score}&characterName=${character}`;
}

// ---------------------- < 캐릭터 설정 > --------------------
// 캐릭터 이미지 설정
function setCharacter(characterData) {
	characterImg.style.width = `${characterData.imagesize[0]}px`;
	characterImg.style.height = `${characterData.imagesize[1]}px`;

	stand_img = characterData.stand_img;
	walk_img = characterData.walk_img;
	atk_img = characterData.atk_img;
	heal_img = characterData.heal_img || "";

	characterImg.src = stand_img;

	characterImg.style.border = "2px dashed red";
	characterImg.style.position = "absolute";
}

function updateCharacter(state) {
	if (state === 'stand') {
		return stand_img;
	}
	else if (state === 'walk') {
		return walk_img;
	}
}

// 히트 박스 설정
function setHitbox(characterData) {
	const { width, height } = characterData.hitbox;

	hitbox.style.width = `${width}px`;
	hitbox.style.height = `${height}px`;

	hitbox.style.border = "2px dashed red";
	hitbox.style.position = "absolute";

	center_offset_x = characterData.hitbox.center_offset.x;
	center_offset_y = characterData.hitbox.center_offset.y;
}

// 충돌 감지
function checkCollision(monster) {
	const hitboxRect = hitbox.getBoundingClientRect(); // 캐릭터 히트박스의 위치와 크기
	const monsterRect = monster.element.getBoundingClientRect(); // 몬스터의 위치와 크기    

	// 히트박스와 몬스터가 겹치는지 확인
	const isColliding =
		hitboxRect.left < monsterRect.right &&
		hitboxRect.right > monsterRect.left &&
		hitboxRect.top < monsterRect.bottom &&
		hitboxRect.bottom > monsterRect.top;

	if (isColliding && canTakeDamage) { // 충돌했으며 데미지를 받을 수 있는 상태라면
		hp -= 1; // HP 감소
		updateGameData(); // HP 업데이트

		// "Hit!" 이미지 표시
		const hitImage = document.createElement("img");
		hitImage.src = "/resources/images/hit.png";
		hitImage.classList.add("hit-effect");
		hitImage.style.width = '50px'; // 이미지 크기 조정 (옵션)
		hitImage.style.height = '50px'; // 이미지 크기 조정 (옵션)
		hitImage.style.left = `${hitboxRect.x - gameRect.x}px`;
		hitImage.style.top = `${hitboxRect.y - gameRect.y}px`;
		hitImage.style.position = "absolute";
		
		game.appendChild(hitImage);
				
		// 1.5초 후 이미지 제거
		setTimeout(() => {
			hitImage.remove();
		}, 1500);
		

		canTakeDamage = false; // 일정 시간 동안 추가 데미지를 받지 않도록 설정
		setTimeout(() => canTakeDamage = true, 2000); // 2초 후 다시 데미지를 받을 수 있도록 설정

		if (hp <= 0 && !isGameOver) { // HP가 0 이하가 되면 게임 종료
			isGameOver = true;
			cancelAnimationFrame(startGame); // 게임 루프 중지
			gameOver();
		}
	}
}

// 어택 박스 설정
function setAtkbox() {
	atkBox = document.createElement("div");
	const hitboxRect = hitbox.getBoundingClientRect(); // 캐릭터 히트박스의 위치와 크기
	const characterRect = characterImg.getBoundingClientRect();
	const characterImgWidth = parseFloat(characterImg.style.width); // 캐릭터 이미지 너비
	const hitboxWidth = parseFloat(hitbox.style.width); // 히트박스 너비

	// 공격 범위 (어택 박스) 설정
	let atkboxWidth = 0;
	let atkboxLeft = 0;

	if (isFacingRight) {
		// 오른쪽을 볼 때
		atkboxWidth = characterImgWidth - (hitboxRect.x - characterRect.x) - hitboxWidth;
		atkboxLeft = hitbox.x - gameRect.x + hitboxWidth;
	} else {
		// 왼쪽을 볼 때
		atkboxWidth = hitboxRect.x - characterRect.x;
		atkboxLeft = characterRect.x - gameRect.x;
	}

	atkBox.style.width = `${atkboxWidth}px`;
	atkBox.style.height = `${hitboxRect.height}px`;
	atkBox.style.position = "absolute";
	atkBox.style.top = `${characterRect.y - gameRect.y}px`;
	atkBox.style.left = `${atkboxLeft}px`;
	atkBox.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // 반투명 빨간색으로 표시
	atkBox.style.border = "2px dashed red";


	console.log(atkBox);
	// 게임 영역에 추가
	game.appendChild(atkBox);
	checkAtkCollision(atkBox);
	// 일정 시간 후 제거 (예: 공격 애니메이션 지속 시간)
	setTimeout(() => {
		game.removeChild(atkBox);
	}, 700);
}


// 공격 시 몬스터와의 충돌 감지
function checkAtkCollision(atkBox) {
	const atkBoxRect = atkBox.getBoundingClientRect(); // atkBox의 위치와 크기 가져오기
	
	monsters.forEach(monster => {
		const monsterRect = monster.element.getBoundingClientRect();
		// 어택 박스와 몬스터가 겹치는지 확인
		const isColliding =
			atkBoxRect.left < monsterRect.right &&
			atkBoxRect.right > monsterRect.left &&
			atkBoxRect.top < monsterRect.bottom &&
			atkBoxRect.bottom > monsterRect.top;

		if (isColliding) {
			console.log(monster.hp);
			// 몬스터 HP 감소
			monster.hp -= atk;

			console.log("atk!");
			// 몬스터 HP가 0 이하일 경우 몬스터 제거
			if (monster.hp <= 0) {
				deadMonster(monster);
				checkLevelUp();
			}
		}
	});
}

function checkLevelUp() {
	if (experience >= 5) {
		level += 1;
		experience = 0;
		isLevelUp = true; // 레벨업 상태로 설정
		showChoiceScreen(); // 선택지 화면 표시
	}
}

function setAtkbox() {
    atkBox = document.createElement("div");
    const hitboxRect = hitbox.getBoundingClientRect(); // 캐릭터 히트박스의 위치와 크기
    const characterRect = characterImg.getBoundingClientRect();
    const characterImgWidth = parseFloat(characterImg.style.width); // 캐릭터 이미지 너비
    const hitboxWidth = parseFloat(hitbox.style.width); // 히트박스 너비

    // 공격 범위 (어택 박스) 설정
    let atkboxWidth = 0;
    let atkboxLeft = 0;

    if (isFacingRight) {
        // 오른쪽을 볼 때
        atkboxWidth = characterImgWidth - (hitboxRect.x - characterRect.x) - hitboxWidth;
        atkboxLeft = hitboxRect.right - gameRect.x;
    } else {
        // 왼쪽을 볼 때
        atkboxWidth = hitboxRect.x - characterRect.x;
        atkboxLeft = characterRect.left - gameRect.x;
    }

    atkBox.style.width = `${atkboxWidth}px`;
    atkBox.style.height = `${hitboxRect.height}px`;
    atkBox.style.position = "absolute";
    atkBox.style.top = `${hitboxRect.y - gameRect.y}px`;
    atkBox.style.left = `${atkboxLeft}px`;
    atkBox.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // 반투명 빨간색으로 표시
    atkBox.style.border = "2px dashed red";

    // 게임 영역에 추가
    game.appendChild(atkBox);
    checkAtkCollision(atkBox);
    // 일정 시간 후 제거 (예: 공격 애니메이션 지속 시간)
    setTimeout(() => {
        game.removeChild(atkBox);
    }, 700);
}


// 공격 시 몬스터와의 충돌 감지
function checkAtkCollision(atkBox) {
    const atkBoxRect = atkBox.getBoundingClientRect(); // atkBox의 위치와 크기 가져오기

    monsters.forEach(monster => {
        const monsterRect = monster.element.getBoundingClientRect();
        // 어택 박스와 몬스터가 겹치는지 확인
        const isColliding =
            atkBoxRect.left < monsterRect.right &&
            atkBoxRect.right > monsterRect.left &&
            atkBoxRect.top < monsterRect.bottom &&
            atkBoxRect.bottom > monsterRect.top;

        if (isColliding) {
            console.log(monster.hp);
            // 몬스터 HP 감소
            monster.hp -= atk;

            console.log("atk!");
            // 몬스터 HP가 0 이하일 경우 몬스터 제거
            if (monster.hp <= 0) {
                deadMonster(monster);
                checkLevelUp();
            }
        }
    });
}

function checkLevelUp() {
    if (experience >= 5)  {
        level += 1;
        experience = 0;
        isLevelUp = true; // 레벨업 상태로 설정
        showChoiceScreen(); // 선택지 화면 표시
    }    
}

function showChoiceScreen() {
    const choiceScreen = document.createElement("div");
    choiceScreen.id = "choiceScreen";
    choiceScreen.style.position = "absolute";
    choiceScreen.style.top = "50%";
    choiceScreen.style.left = "50%";
    choiceScreen.style.transform = "translate(-50%, -50%)";
    choiceScreen.style.background = "#f4f4f9";
    choiceScreen.style.padding = "20px";
    choiceScreen.style.borderRadius = "15px";
    choiceScreen.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)";
    choiceScreen.style.textAlign = "center";
    choiceScreen.style.fontFamily = "'Arial', sans-serif";

    // 카드 컨테이너
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "10px";  // 카드 간격 줄이기
    container.style.justifyContent = "center";
    container.style.padding = "10px";  // 카드 간격을 조정하기 위한 패딩 추가

    // 옵션 카드 배열
    const options = [
        { title: "속도 증가", description: "속도가 0.2 증가합니다!", img: "/resources/images/haste.png" },
        { title: "체력 증가", description: "체력 1을 회복합니다!", img: "/resources/images/heal.png"},
        { title: "공격력 증가", description: "공격력이 1 상승합니다!", img: "/resources/images/rage.png" }
    ];

    options.forEach((option, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.background = "#fff";
        card.style.borderRadius = "8px";
        card.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        card.style.overflow = "hidden";
        card.style.width = "200px";  // 카드 너비 줄이기
        card.style.textAlign = "center";
        card.style.transition = "transform 0.3s, box-shadow 0.3s";

        card.onmouseover = () => {
            card.style.transform = "translateY(-5px)";  // 이동 거리 줄이기
            card.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.2)";
        };
        card.onmouseout = () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        };

        // 카드 이미지
        const img = document.createElement("img");
        img.src = option.img;
        img.alt = option.title;
        img.style.width = "120px";
        img.style.height = "120px";  // 이미지 높이 줄이기
        img.style.objectFit = "cover";
        card.appendChild(img);

        // 카드 내용
        const content = document.createElement("div");
        content.style.padding = "10px";  // 내부 여백 줄이기

        const cardTitle = document.createElement("h2");
        cardTitle.innerText = option.title;
        cardTitle.style.fontSize = "1.2rem";  // 제목 크기 줄이기
        cardTitle.style.marginBottom = "8px";
        cardTitle.style.color = "#333";
        content.appendChild(cardTitle);

        const cardDescription = document.createElement("p");
        cardDescription.innerText = option.description;
        cardDescription.style.fontSize = "0.9rem";  // 설명 텍스트 크기 줄이기
        cardDescription.style.color = "#666";
        cardDescription.style.marginBottom = "15px";
        content.appendChild(cardDescription);

        const cardButton = document.createElement("button");
        cardButton.innerText = "Select";
        cardButton.style.display = "inline-block";
        cardButton.style.padding = "8px 15px";  // 버튼 크기 줄이기
        cardButton.style.backgroundColor = "#007BFF";
        cardButton.style.color = "white";
        cardButton.style.border = "none";
        cardButton.style.borderRadius = "5px";
        cardButton.style.textDecoration = "none";
        cardButton.style.fontSize = "0.9rem";  // 버튼 텍스트 크기 줄이기
        cardButton.style.cursor = "pointer";
        cardButton.style.transition = "background 0.3s";

        cardButton.onmouseover = () => {
            cardButton.style.backgroundColor = "#0056b3";
        };
        cardButton.onmouseout = () => {
            cardButton.style.backgroundColor = "#007BFF";
        };

        // 클릭 이벤트
        cardButton.onclick = () => handleChoice(index);
        content.appendChild(cardButton);

        card.appendChild(content);
        container.appendChild(card);
    });

    choiceScreen.appendChild(container);
    document.body.appendChild(choiceScreen);

    // 키보드 입력 이벤트 리스너 추가
    window.addEventListener("keydown", handleKeyPress);
}


function handleChoice(choiceIndex) {
	// 선택지에 따른 행동 처리
	switch (choiceIndex) {
		case 0:
			// 속도 증가
			speed += 0.2;
			speed = parseFloat(speed.toFixed(1));  // 소수점 첫째 자리까지 반올림
			break;
		case 1:
			if (hp >= maxHp) {
				alert("이미 최대 체력입니다!");
				return;
			}
			hp += 1;
			break;
		case 2:
			// 공격력 증가
			atk += 1;
			break;
	}

	// 선택 후 처리
	resumeGame();
}

function handleKeyPress(event) {
	if (isLevelUp) {
		if (event.key === "1") {
			handleChoice(0);
		} else if (event.key === "2") {
			handleChoice(1);
		} else if (event.key === "3") {
			handleChoice(2);
		}
	}
}

function resumeGame() {
	isLevelUp = false; // 레벨업 상태 해제
	document.getElementById("choiceScreen").remove(); // 선택지 화면 제거

	// 키보드 이벤트 리스너 제거
	window.removeEventListener("keydown", handleKeyPress);

	// 게임 로직 재개
	console.log("Game resumed!");

	// 게임 루프 재개
	requestAnimationFrame(startGame);
}

document.addEventListener("keydown", (event) => {
	if (event.key === 'a' || event.key === 'A') {
		if (!isAtkMode) {
			isAtkMode = true;
			characterImg.src = atk_img;

			// 어택 박스 계산 및 충돌 감지
			setAtkbox();
			setTimeout(() => {
				isAtkMode = false;
				characterImg.src = isMoving ? walk_img : stand_img;
			}, 700);
		}
		return;
	}

	if (keysPressed.hasOwnProperty(event.key)) {
		keysPressed[event.key] = true;
	}
});

document.addEventListener("keyup", (event) => {
	if (keysPressed.hasOwnProperty(event.key)) {
		keysPressed[event.key] = false;
	}
});

function moveCharacter() {
	const characterImgWidth = parseFloat(characterImg.style.width);
	const hitboxWidth = parseFloat(hitbox.style.width); // 문자열을 숫자로 변환
	const hitboxHeight = parseFloat(hitbox.style.height);

	isMoving = false;

	if (!isAtkMode) {
		if (keysPressed.ArrowUp) {
			position.y = Math.max(position.y - speed, 0);
			isMoving = true;
		}
		if (keysPressed.ArrowDown) {
			position.y = Math.min(position.y + speed, gameRect.height - hitboxHeight);
			isMoving = true;
		}
		if (keysPressed.ArrowLeft) {
			position.x = Math.max(position.x - speed, 0);
			isMoving = true;
			if (isFacingRight) {
				characterImg.style.transform = "scaleX(1)";
				isFacingRight = false;
			}
		}
		if (keysPressed.ArrowRight) {
			position.x = Math.min(position.x + speed, gameRect.width);
			isMoving = true;
			if (!isFacingRight) {
				characterImg.style.transform = "scaleX(-1)";
				isFacingRight = true;
			}
		}
	}

	characterImg.style.left = `${position.x - center_offset_x}px`;
	characterImg.style.top = `${position.y - center_offset_y}px`;

	if (hitbox) {
		if (isFacingRight) {
			hitbox.style.left = `${position.x - (center_offset_x - (characterImgWidth - (hitboxWidth + center_offset_x)))}px`;
		} else {
			hitbox.style.left = `${position.x}px`;
		}
		hitbox.style.top = `${position.y}px`;
	}

	const newState = isMoving ? "walk" : "stand";
	if (!isAtkMode && currentState !== newState) {
		currentState = newState;
		characterImg.src = updateCharacter(currentState);
	}
}

// -------------------------- < 몬스터 > ------------------------------------
async function spawnMonster(monsterData) {
	try {
		console.log(monsterData);

		// 몬스터 종류 리스트
		const monsterNames = Object.keys(monsterData); // 'snail', 'slime', 'goblin' 등

		// 랜덤으로 몬스터 종류 선택
		const randomMonsterName = monsterNames[Math.floor(Math.random() * ((level / 2) < monsterNames.length ? (level / 2) : monsterNames.length))];
		const monster = monsterData[randomMonsterName];

		// 몬스터 수 설정
		const numberOfMonsters = Math.floor(Math.random() * 4) + 1;

		// 몬스터 수만큼 생성
		for (let i = 0; i < numberOfMonsters; i++) {
			const monsterWidth = monster.size[0];
			const monsterHeight = monster.size[1];

			// 랜덤 위치 계산 (gameRect의 가장자리)
			const side = Math.floor(Math.random() * 4); // 0: 위, 1: 아래, 2: 왼쪽, 3: 오른쪽
			let x, y;

			switch (side) {
				case 0: // 위쪽
					x = Math.random() * (gameRect.width - monsterWidth) + gameRect.x;
					y = monsterHeight;
					break;
				case 1: // 아래쪽
					x = Math.random() * (gameRect.width - monsterWidth) + gameRect.x;
					y = gameRect.height - monsterHeight;
					break;
				case 2: // 왼쪽
					x = monsterWidth;
					y = Math.random() * (gameRect.height - monsterHeight) + gameRect.y;
					break;
				case 3: // 오른쪽
					x = gameRect.width - monsterWidth;
					y = Math.random() * (gameRect.height - monsterHeight) + gameRect.y;
					break;
			}

			// 몬스터 DOM 요소 생성
			const monsterElement = document.createElement("img");
			monsterElement.src = monster.image;
			monsterElement.style.width = `${monsterWidth}px`;
			monsterElement.style.height = `${monsterHeight}px`;
			monsterElement.style.position = "absolute";
			monsterElement.style.left = `${x}px`;
			monsterElement.style.top = `${y}px`;

			// 몬스터 정보를 객체로 저장
			const monsterObj = {
				element: monsterElement,
				x: x,
				y: y,
				hp: monster.hp,
				exp: monster.exp,
				speed: monster.speed,
				width: monsterWidth,
				height: monsterHeight
			};

			// 몬스터 배열에 추가
			monsters.push(monsterObj);

			// 몬스터를 게임 영역에 추가
			game.appendChild(monsterElement);

			console.log(`Monster spawned at x: ${x}, y: ${y}`);
		}
	} catch (error) {
		console.error("Error spawning monster:", error);
	}
}

// 몬스터 움직임
function moveMonster(monster) {
	const dx = position.x - monster.x; // 캐릭터와 몬스터 간의 x축 거리 계산
	const dy = position.y - monster.y; // 캐릭터와 몬스터 간의 y축 거리 계산
	const distance = Math.sqrt(dx ** 2 + dy ** 2); // 캐릭터와 몬스터 사이의 유클리드 거리

	if (distance > 0) {
		const moveX = (dx / distance) * monster.speed; // 몬스터의 x축 이동 거리
		const moveY = (dy / distance) * monster.speed; // 몬스터의 y축 이동 거리

		monster.x += moveX; // 몬스터의 x 좌표 업데이트
		monster.y += moveY; // 몬스터의 y 좌표 업데이트

		monster.element.style.left = `${monster.x}px`; // 몬스터의 DOM 요소 위치 업데이트 (x축)
		monster.element.style.top = `${monster.y}px`; // 몬스터의 DOM 요소 위치 업데이트 (y축)
	}
}

function deadMonster(monster) {
	console.log("Monster defeated!");
	monster.element.remove(); // 몬스터 제거
	monsters = monsters.filter(m => m !== monster); // 배열에서 몬스터 삭제
	score += monster.exp;
	experience += monster.exp;
}

document.addEventListener('DOMContentLoaded', () => {
	character = characterName;
	fetchCharacterStatus(characterName);
	startGame();
});
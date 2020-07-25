let container = document.getElementById('container');
let startButton = document.getElementById('startButton');
let crossChoice = document.getElementById('crossChoice');
let zeroChoice = document.getElementById('zeroChoice');
let startButtonBlock = document.getElementById('startButtonBlock');
let infoBlock = document.getElementById('info');
let choiceBlock = document.getElementById('choiceBlock');
let numbersSells = [];

let count = 1; //счетчик ходов
let playerChoice = 0;//0 - не выбрано, 1 - игрок крестиками, 2 - игрок ноликами
let winner = 0;
let game = 0;

let checkSell;


//Создаю игровое поле
function createField() {
	
	for(let i = 0; i <= 8; i++) {
		let sell = document.createElement('div');
		sell.classList = "sell";
		sell.id = i;
		
		container.append(sell);
		
		numbersSells.push(i);
	}
}

createField();


//делаем выбор кем играть
function makeChoice() {
	
	if (crossChoice.checked) {
		playerChoice = 1;
	} else if (zeroChoice.checked) {
		playerChoice = 2;
	}
	
	startButtonBlock.style.display = "block";
	
}


//начинаем или рестарт
function start() {
	if (game == 1) {
		restartGame();
	} else {
		startGame();
	}
}


//рестарт
function restartGame() {
	if (playerChoice) {
		
		numbersSells = [];
		
		for (let i = 0; i <= 8; i++) {
			container.childNodes[i].classList = "sell";
			container.childNodes[i].innerHTML = "";
			
			numbersSells.push(i)
		}
		
		count = 1;
		playerChoice = 0;
		game = 0;
		winner = 0;
		
		choiceBlock.style.display = "block";
		
		startButtonBlock.style.display = "none";
		
		startButton.innerHTML = "Начать!";
		
		infoBlock.style.display = "none";
		
		crossChoice.checked = false;
		zeroChoice.checked = false;
        
        container.removeEventListener("click", changeCell);
	}
}


//старт, скрываювыбор стороны
function startGame() {
	
	//let choiceBlock = document.getElementById('choiceBlock');
	choiceBlock.style.display = "none";
	
	startButton.innerHTML = "Начать заново!";
	
	if (playerChoice == 1 && count == 1) {
		container.addEventListener("click", changeCell);
		showStartInfo(1);
	} else if (playerChoice == 2 && count == 1) {
		playZero();
		showStartInfo(0);
	}
	
	game = 1;
}


//показываю стартовое инфо
function showStartInfo(a) {
	if (a) {
		infoBlock.innerHTML = "Ставьте крестик!";
		infoBlock.style.display = "block";
	} else {
		infoBlock.innerHTML = "Ставьте нолик!";
		infoBlock.style.display = "block";
	}
}


//ход крестиком или ноликом
function changeCell() {
	
	clickCell = event.target;
	
	if (clickCell.classList == "sell") {
		
		if (count % 2) {
			clickCell.classList = "sellCross";
			clickCell.innerHTML = "X";
			
			count++;
			
			numbersSells.splice((clickCell.id), 1, "X");
			console.log(numbersSells);
			
			changeInfo();
			
			if (count == 10) {
				checkDraw();
			} else {
				playCross();
			}
			
		} else {
			clickCell.classList = "sellZero";
			clickCell.innerHTML = "O";
			
			count++;
			
			numbersSells.splice((clickCell.id), 1, "O");
			console.log(numbersSells);
			
			changeInfo();
			
			playZero();
			
		}
	}
}


//целое рандомное число
function getRandomNumber(min, max) {
	let rand = min + Math.random() * (max - min + 1);
	return Math.floor(rand);
}


//Игра за нолики, комп делает первый ход
function playZero() {
	
	if (count == 1) {
		let i = getRandomNumber(1, 5) * 2 - 2; //ставим крестик в центр или рандомный угол
		
		putCross(i);
		
		changeInfo();
		
		console.log(numbersSells);
		
		container.addEventListener("click", changeCell);
	} else if (count == 3) {
		putSecondCross();
	} else {
		putNextCross();
	}
}


//Игра за крестики
function playCross(){
	
	if (count == 2) {
		putFirstZero();
	} else if (count == 4) {
		putSecondZero();
	} else {
		putNextZero();
	}
}


//первый ход нолика
function putFirstZero() {
	if (container.childNodes[4].classList == "sell") {
		putZero(4);
		
		changeInfo();
	} else {
		let numbersAngles = [0, 2, 6, 8];
		let i = getRandomNumber(0, 3);
		putZero(numbersAngles[i]);
		
		changeInfo();
	}
}


//ставим второй нолик
function putSecondZero() {
	
	for (let i = 0; i <= 8; i++) {
		
		if (isFinite(numbersSells[i])){
			
			checkSell = container.childNodes[i];
			checkSell.coordinate = {
				x: 0,
				y: 0,
			}
			
			getCoordinate(i);
			
			if (i % 2) {
				
				let horizontalLine = findHorizontalNeighbors(1);
				let verticalLine = findVerticalNeighbors(1);
				
				if (horizontalLine.length == 2 || verticalLine.length == 2) {
					putZero(i);
					
					changeInfo();
					break;
				}
			} else {
				
				let horizontalLine = findHorizontalNeighbors(1);
				let verticalLine = findVerticalNeighbors(1);
				let firstDiagonalLine = findFirstDiagonalNeighbors(1);
				let secondDiagonalLine = findSecondDiagonalNeighbors(1);
				
				if (horizontalLine.length == 2 || verticalLine.length == 2 || firstDiagonalLine.length == 2 || secondDiagonalLine.length == 2) {
					putZero(i);
					
					changeInfo();
					break;
				}
			}
		}
	}
	if (!(count % 2)) {
		if (container.childNodes[4].classList == "sellZero") {
			
			let numbersAngles = [0, 2, 6, 8];
			let badAngles = [];
			
			for (let key of numbersAngles) {
				if (container.childNodes[key].classList == "sellCross") {
					badAngles.push(key);
				}
			}
			if (badAngles.length > 1) {
				
				let sideSells = [1, 3, 5, 7];
				let i = getRandomNumber(0, 3);
				
				putZero(sideSells[i]);
				
				changeInfo();
			} else {
				
				let i = getRandomNumber(0, 3);
				
				if (container.childNodes[numbersAngles[i]].classList == "sellCross") {
					
					numbersAngles.splice(i, 1);
					
					i = getRandomNumber(0, 2);
					
					putZero(numbersAngles[i]);
					
					changeInfo();
				} else {
					putZero(numbersAngles[i]);
					
					changeInfo();
				}
			}
		} else {
			let numbersAngles = [0, 2, 6, 8];
			let goodAngles = [];
			
			for (let key of numbersAngles) {
				if (container.childNodes[key].classList == "sell") {
					goodAngles.push(key);
				}
			}
			
			let i = getRandomNumber(0, (goodAngles.length - 1));
			
			putZero(goodAngles[i]);
			
			changeInfo();
		}
	}
}


//ставим следующий нолик
function putNextZero() {
	
	//прохожу по всем ячейкам и для свободных провряю соседей на 2 подряд нолика
	for (let i = 0; i <= 8; i++) {
		
		if (isFinite(numbersSells[i])){
			
			checkSell = container.childNodes[i];
			checkSell.coordinate = {
				x: 0,
				y: 0,
			}
			
			getCoordinate(i);
			
			if (i % 2) {
				
				let horizontalLine = findHorizontalNeighbors(0);
				let verticalLine = findVerticalNeighbors(0);
				
				if (horizontalLine.length == 2 || verticalLine.length == 2) {
					putZero(i);
					
					if (horizontalLine.length == 2) {
						showWinnerComp(0, i, horizontalLine[0], horizontalLine[1]);
					} else {
						showWinnerComp(0, i, verticalLine[0], verticalLine[1]);
					}
					
					break;
				}
			} else {
				
				let horizontalLine = findHorizontalNeighbors(0);
				let verticalLine = findVerticalNeighbors(0);
				let firstDiagonalLine = findFirstDiagonalNeighbors(0);
				let secondDiagonalLine = findSecondDiagonalNeighbors(0);
				
				if (horizontalLine.length == 2 || verticalLine.length == 2 || firstDiagonalLine.length == 2 || secondDiagonalLine.length == 2) {
					putZero(i);
					
					if (horizontalLine.length == 2) {
						showWinnerComp(0, i, horizontalLine[0], horizontalLine[1]);
					} else if (verticalLine.length == 2) {
						showWinnerComp(0, i, verticalLine[0], verticalLine[1]);
					} else if (firstDiagonalLine.length == 2) {
						showWinnerComp(0, i, firstDiagonalLine[0], firstDiagonalLine[1]);
					} else {
						showWinnerComp(0, i, secondDiagonalLine[0],secondDiagonalLine[1]);
					}
					
					break;
				}
			}
		}
	}
	
	//прохожу по всем ячейкам и для свободных провряю соседей на 2 подряд крестика
	if (!(count % 2)) {
		
		for (let i = 0; i <= 8; i++) {
			
			if (isFinite(numbersSells[i])) {
				
				checkSell = container.childNodes[i];
				checkSell.coordinate = {
					x: 0,
					y: 0,
				}
				
				getCoordinate(i);
				
				if (i % 2) {
					
					let horizontalLine = findHorizontalNeighbors(1);
					let verticalLine = findVerticalNeighbors(1);
					
					if (horizontalLine.length == 2 || verticalLine.length == 2) {
						putZero(i);
						
						changeInfo();
						break;
					}
				} else {
					
					let horizontalLine = findHorizontalNeighbors(1);
					let verticalLine = findVerticalNeighbors(1);
					let firstDiagonalLine = findFirstDiagonalNeighbors(1);
					let secondDiagonalLine = findSecondDiagonalNeighbors(1);
					
					if (horizontalLine.length == 2 || verticalLine.length == 2 || firstDiagonalLine.length == 2 || secondDiagonalLine.length == 2) {
						putZero(i);
						
						changeInfo();
						break;
					}
				}
			}
		}
	}
	
	//если нет 2х подряд крестиков или ноликов, прохожу по ячейкам и нахожу отдельно пустые угловые и пустые боковые ячейки
	if (!(count % 2)) {
		
		let angularSells = [];
		let sideSells = [];
		
		for (let i = 0; i <= 8; i++) {
			
			if (isFinite(numbersSells[i])){
				if (numbersSells[i] % 2) {
					sideSells.push(numbersSells[i]);
				} else {
					angularSells.push(numbersSells[i]);
				}
			}
		}
		
		if (angularSells.length) {
			let i = getRandomNumber(0, (angularSells.length - 1));
			putZero(angularSells[i]);
			
			changeInfo();
		} else if (sideSells.length) {
			let i = getRandomNumber(0, (sideSells.length - 1));
			putZero(sideSells[i]);
			
			changeInfo();
		}
	}
}


//Второй ход компа за крестики
function putSecondCross() {
	
	if (container.childNodes[4].classList == "sellCross") {
		
		putSecondCrossInAngle();
		
	} else {
		
		if (container.childNodes[4].classList == "sellZero") {
			
			putSecondCrossInAngle();
			
		} else {
			putCross(4);
			console.log(numbersSells);
			
			changeInfo();
		}
	}
}


//ставлю крестик в угол
function putSecondCrossInAngle() {
	let numbersAngles = [0, 2, 6, 8];
	let miss = 0;
	
	for (let key of numbersAngles) {
		if (container.childNodes[key].classList == "sellCross") {
			putCross(8 - key);
			
			changeInfo();
			break;
		} else {
			miss++;
		}
	}
	
	if (miss == 4) {
		let i = getRandomNumber(0, 3);
		
		if (container.childNodes[numbersAngles[i]].classList != "sell") {
			
			numbersAngles.splice(i, 1); //если угол занят, выбираем один из 3х оставшихся
			
			i = getRandomNumber(0, 2);
			
			putCross(numbersAngles[i]);
			
			changeInfo();
			console.log(numbersSells);
		} else {
			putCross(numbersAngles[i]);
			
			changeInfo();
			console.log(numbersSells);
		}
	}

}


//ставим крестик
function putCross(k) {
	container.childNodes[k].classList = "sellCross";
	container.childNodes[k].innerHTML = "X";
	count++;
	
	numbersSells.splice(k, 1, "X");
	
	if (count == 10) {
		checkDraw();
	}
}


//ставим нолик
function putZero(k) {
	container.childNodes[k].classList = "sellZero";
	container.childNodes[k].innerHTML = "O";
	count++;
	
	numbersSells.splice(k, 1, "O");
}


//ставлю следующий крестик
function putNextCross() {
	
	//прохожу по всем ячейкам и для свободных провряю соседей на 2 подряд крестика
	for (let i = 0; i <= 8; i++) {
		
		if (isFinite(numbersSells[i])) {
			
			checkSell = container.childNodes[i];
			checkSell.coordinate = {
				x: 0,
				y: 0,
			}
			
			getCoordinate(i);
			
			if (i % 2) {
				
				let horizontalLine = findHorizontalNeighbors(1);
				let verticalLine = findVerticalNeighbors(1);
				
				if (horizontalLine.length == 2 || verticalLine.length == 2) {
					putCross(i);
					
					if (horizontalLine.length == 2) {
						showWinnerComp(1, i, horizontalLine[0], horizontalLine[1]);
					} else {
						showWinnerComp(1, i, verticalLine[0], verticalLine[1]);
					}
					
					break;
				}
				
			} else {
				
				let horizontalLine = findHorizontalNeighbors(1);
				let verticalLine = findVerticalNeighbors(1);
				let firstDiagonalLine = findFirstDiagonalNeighbors(1);
				let secondDiagonalLine = findSecondDiagonalNeighbors(1);
				
				if (horizontalLine.length == 2 || verticalLine.length == 2 || firstDiagonalLine.length == 2 || secondDiagonalLine.length == 2) {
					putCross(i);
					
					if (horizontalLine.length == 2) {
						showWinnerComp(1, i, horizontalLine[0], horizontalLine[1]);
					} else if (verticalLine.length == 2) {
						showWinnerComp(1, i, verticalLine[0], verticalLine[1]);
					} else if (firstDiagonalLine.length == 2) {
						showWinnerComp(1, i, firstDiagonalLine[0], firstDiagonalLine[1]);
					} else {
						showWinnerComp(1, i, secondDiagonalLine[0], secondDiagonalLine[1]);
					}
					
					break;
				}
				
			}
			
		}
	}
	
	//не нашёл 2 подряд крестика прохожу по всем ячейкам и для свободных провряю соседей на 2 подряд нолика
	if (count % 2){
		
		for (let i = 0; i <= 8; i++) {
			
			if (isFinite(numbersSells[i])) {
			
				checkSell = container.childNodes[i];
				checkSell.coordinate = {
					x: 0,
					y: 0,
				}
			
				getCoordinate(i);
			
				if (i % 2) {
					
					let horizontalLine = findHorizontalNeighbors(0);
					let verticalLine = findVerticalNeighbors(0);
					
					if (horizontalLine.length == 2 || verticalLine.length == 2) {
						putCross(i);
						
						changeInfo();
						break;
					}
				} else {
					
					let horizontalLine = findHorizontalNeighbors(0);
					let verticalLine = findVerticalNeighbors(0);
					let firstDiagonalLine = findFirstDiagonalNeighbors(0);
					let secondDiagonalLine = findSecondDiagonalNeighbors(0);
					
					if (horizontalLine.length == 2 || verticalLine.length == 2 || firstDiagonalLine.length == 2 || secondDiagonalLine.length == 2) {
						putCross(i);
						
						changeInfo();
						break;
					}
				}
			
			}
			
		}
	}
	
	//если нет 2х подряд крестиков или ноликов, прохожу по ячейкам и нахожу отдельно пустые угловые и пустые боковые ячейки
	if (count % 2){
		
		let angularSells = [];
		let sideSells = [];
		
		for (let i = 0; i <= 8; i++) {
			
			if (isFinite(numbersSells[i])){
				if (numbersSells[i] % 2) {
					sideSells.push(numbersSells[i]);
				} else {
					angularSells.push(numbersSells[i]);
				}
			}
		}
		
		// если есть угловые, то выбираю рандомно одну из них, рядом с пустой боковой, если нет, то рандомную боковую
		if (angularSells.length) {
			
			if (angularSells.length > 1) {
				let i = getRandomNumber(0, (angularSells.length - 1));
				
				checkSell = container.childNodes[angularSells[i]];
				checkSell.coordinate = {
					x: 0,
					y: 0,
				}
				
				getCoordinate(angularSells[i]);
				
				let horizontalLine = findHorizontalNeighbors(0);
				let verticalLine = findVerticalNeighbors(0);
				
				if (horizontalLine.length == 1 || verticalLine.length == 1) {
					angularSells.splice(i, 1);
					putCross(angularSells[0]);
					
					changeInfo();
				} else {
					putCross(angularSells[i]);
					
					changeInfo();
				}
			} else {
				putCross(angularSells[0]);
				
				changeInfo();
			}
			
		} else if (sideSells.length) {
			let i = getRandomNumber(0, (sideSells.length - 1));
			putCross(sideSells[i]);
			
			changeInfo();
		}
	}
	
    if (count == 10) {
        checkDraw();
    }
}


//Определяю координаты отмеченой ячейки
function getCoordinate(a) {
	
	let n = a + 1;
	
	if (n % 3) {
		checkSell.coordinate.x = n % 3;
		checkSell.coordinate.y = Math.floor(n / 3) + 1;
	} else {
		checkSell.coordinate.x = 3;
		checkSell.coordinate.y = n / 3;
	}
	
}


//Определяем id по координатам
function getId(x, y) {
	
	let id = (y - 1) * 3 + x - 1;
	return id;
}


//ишу соседей по горизонтали
function findHorizontalNeighbors(a) {
	
	let sellClass;
	
	if (a) {
		sellClass = "sellCross";
	} else {
		sellClass = "sellZero";
	}
		
	let neighbors = [];
	
	for (let i = 1; i < checkSell.coordinate.x; i++) {
		
		let leftNeighbor = container.childNodes[getId(checkSell.coordinate.x - i, 	checkSell.coordinate.y)];
	
		if (leftNeighbor.classList == sellClass) {
			neighbors.push(leftNeighbor.id);
			
		} else {
			break;
		}
	}
	
	for (let k = 1; k <= 3 - checkSell.coordinate.x; k++) {
		
		let rightNeighbor = container.childNodes[getId(checkSell.coordinate.x + k, 	checkSell.coordinate.y)]
		
		if (rightNeighbor.classList == sellClass) {
			neighbors.push(rightNeighbor.id);
		} else {
			break;
		}
	}
	
	return neighbors;
}


//ищу соседей по вертикали
function findVerticalNeighbors(a) {
	
	let sellClass;
	
	if (a) {
		sellClass = "sellCross";
	} else {
		sellClass = "sellZero";
	}
	
	let neighbors = [];
	
	for (let i = 1; i < checkSell.coordinate.y; i++) {
		
		let upNeighbor = container.childNodes[getId(checkSell.coordinate.x, checkSell.coordinate.y - i,)]
		
		if (upNeighbor.classList == sellClass) {
			neighbors.push(upNeighbor.id);
			
		} else {
			break;
		}
	}
	
	for (let k = 1; k <= 3 - checkSell.coordinate.y; k++) {
		
		let downNeighbor = container.childNodes[getId(checkSell.coordinate.x, checkSell.coordinate.y + k)]
		
		if (downNeighbor.classList == sellClass) {
			neighbors.push(downNeighbor.id);
		} else {
			break;
		}
	}
	
	return neighbors;
}


//ищу соседей по диагонали 1
function findFirstDiagonalNeighbors(a) {
	
	let sellClass;
	
	if (a) {
		sellClass = "sellCross";
	} else {
		sellClass = "sellZero";
	}
	
	let neighbors = [];
	
	for (let i = 1; (i < checkSell.coordinate.x) && (i < checkSell.coordinate.y) ; i++) {
		
		let leftUpNeighbor = container.childNodes[getId(checkSell.coordinate.x - i, checkSell.coordinate.y - i)]
		
		if (leftUpNeighbor.classList == sellClass) {
			neighbors.push(leftUpNeighbor.id);
			
		} else {
			break;
		}
	}
	
	for (let k = 1; (k <= 3 - checkSell.coordinate.x) && (k <= 3 - checkSell.coordinate.y); k++) {
		
		let rightDownNeighbor = container.childNodes[getId(checkSell.coordinate.x + k, checkSell.coordinate.y + k)]
		
		if (rightDownNeighbor.classList == sellClass) {
			neighbors.push(rightDownNeighbor.id);
		} else {
			break;
		}
	}
	
	return neighbors;
}


//ищу соседей по диагонали 2
function findSecondDiagonalNeighbors(a) {
	
	let sellClass;
	
	if (a) {
		sellClass = "sellCross";
	} else {
		sellClass = "sellZero";
	}
	
	let neighbors = [];
	
	for (let i = 1; (i <= 3 - checkSell.coordinate.x) && (i < checkSell.coordinate.y) ; i++) {
		
		let rightUpNeighbor = container.childNodes[getId(checkSell.coordinate.x + i, checkSell.coordinate.y - i)]
		
		if (rightUpNeighbor.classList == sellClass) {
			neighbors.push(rightUpNeighbor.id);
			
		} else {
			break;
		}
	}
	
	for (let k = 1; (k < checkSell.coordinate.x) && (k <= 3 - checkSell.coordinate.y); k++) {
		
		let leftDownNeighbor = container.childNodes[getId(checkSell.coordinate.x - k, checkSell.coordinate.y + k)]
		
		if (leftDownNeighbor.classList == sellClass) {
			neighbors.push(leftDownNeighbor.id);
		} else {
			break;
		}
	}
	
	return neighbors;
}


//показываю победителя компьютера
function showWinnerComp(a, ...arr) {
	
	if (a) {
		infoBlock.innerHTML = "Выиграли крестики!";
		winner = 1;
	} else {
		infoBlock.innerHTML = "Выиграли нолики!";
		winner = 1;
	}
	
	for (let key of arr) {
		container.childNodes[key].classList = "sellWinner";
	}
	
	container.removeEventListener("click", changeCell);
}


//показываю инфо ничья
function checkDraw() {
	if (!winner) {
		infoBlock.innerHTML = "Ничья!";
	}
}

function changeInfo() {
	if (!(count % 2)) {
		infoBlock.innerHTML = "Следующий ход. Ставьте нолик.";
	} else {
		infoBlock.innerHTML = "Следующий ход. Ставьте крестик.";
	}
}
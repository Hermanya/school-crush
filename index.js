(function () {
    var subjects = [{
            name: "Geography",
            icons: ["🗺", "🇺🇸", "🇪🇺", "🇷🇺", "🇨🇳"]
        }, {
            name: "History",
            icons: ["⚔", "🏺", "👑", "📜", "🗿"]
        }, {
            name: "Chemistry",
            icons: ["⚗", "☢", "⚛", "🔬", "🎇"]
        }, {
            name: "Biology",
            icons: ["☣", "🐁", "🐒", "🌱", "🐠"]
        }, {
            name: "Physics",
            icons: ["⚙", "🔭", "💡",  "🔋", "🌡"]
        }, {
            name: "English",
            icons: ["✍", "🇬🇧", "🇺🇸", "📝", "💬"]
        }, {
            name: "Music",
            icons: ["🎺", "🎻", "🎹", "🎵", "🎼"]
        }, {
            name: "Maths",
            icons: ["🔢", "➕", "➖", "➗", "📊"]
        }, {
            name: "Art",
            icons: ["🎭", "🖼", "🎨", "🖌", "🖍"]
        }, {
            name: "Physical education",
            icons: ["⛹", "🏐", "🏅", "⚽", "🏈"]
        }, {
            name: "Informatics",
            icons: ["💾", "🖥", "💿", "⌨", "🤖"]
        }],
        schedule = JSON.parse(localStorage.schedule || 'false') || createSchedule(),
        gameBegun,
        lessonIndex = JSON.parse(localStorage.lessonIndex || '0'),
        lesson = schedule[lessonIndex],
        columns = [0, 1, 2, 3, 4],
        rows = [0, 1, 2, 3, 4, 5, 6, 7],
        boardElement = document.querySelector('.board'),
        board = columns.map(function () {
            return [];
        }),
        score,
        animationTime = 0;

    function createSchedule () {
        var schedule = [1, 2, 3, 4, 5, 6].map(function () {
            return subjects[subjects.length * Math.random() | 0];
        });
        localStorage.schedule = JSON.stringify(schedule);
        return schedule;
    }

    function nextLesson () {
        lessonIndex++;
        if (!schedule[lessonIndex]) {
            schedule = createSchedule();
            lessonIndex = 0;
        }
        localStorage.lessonIndex = lessonIndex;
        lesson = schedule[lessonIndex];
        showSchedule();
        gameBegun = false;
        location.hash = '#schedule';
        boardElement.innerHTML = '';
        board = columns.map(function () {
            return [];
        });
        showSubject();
    }

    boardElement.addEventListener('mousedown', tryToSwap);

    function showView() {
        if (window.location.hash === '#lesson') {
            document.querySelector('.page').classList.remove('flipped');
        } else {
            document.querySelector('.page').classList.add('flipped');
        }
    }

    showView();
    window.onhashchange = showView;

    function showSchedule () {
        document.querySelector('#schedule').innerHTML = '<div><h1>date</h1><ol>'.replace('date', new Date().toLocaleDateString()) +
        schedule.map(function (lesson, index) {
            if (lessonIndex > index) {
                return '<li> name <span>✓</span>'
                    .replace('name', lesson.name);
            } else if  (lessonIndex === index) {
                return '<li> <a href="#lesson"> name </a>'
                    .replace('name', lesson.name);
            } else {
                return '<li> name'
                    .replace('name', lesson.name);
            }
        }).join('</br>') + '</ol>';
    }
    showSchedule();

    function showSubject() {
        document.querySelector('.teacher p').innerText = lesson.name;
        update().then(function () {
            gameBegun = true;
            score = 0;
            animationTime = 500;
            document.querySelector('.score').textContent = 'Let\'s get started!';
        });
    }
    showSubject();

    function inscreaseScore () {
        score += 1;
        if (score) {
            document.querySelector('.score').textContent = score.toString() + '%';
        }
    }

    function makeTile (x, y) {
        var tile = makeTileElement();
        tile.x = x;
        tile.y = y;
        tile.type = tile.innerHTML;
        setTransformation(tile);
        return tile;
    }

    function makeTileElement () {
        var tileElement = document.createElement('div');
        boardElement.appendChild(tileElement);
        tileElement.setAttribute('class', 'tile');
        tileElement.innerHTML = makeIcon();
        return tileElement;
    }

    function makeIcon () {
        return lesson.icons[lesson.icons.length * Math.random() | 0];
    }

    function setTransformation (tile) {
        tile.style.top = tile.y*46 + 'px';
        tile.style.left = tile.x*18 + '%';
        return tile;
    }

    var swapper;
    function tryToSwap (event) {
        var swappee = event.target;
        if (swapper) {
            swap(swappee, swapper);
            swapper.classList.remove('selected');
            update().then(function () {
                if (swappee.parentElement && swapper.parentElement) {
                    wait(animationTime).then(swap.bind(null, swappee, swapper));
                }
                swapper = undefined;
            });
        } else {
            swapper = swappee;
            swapper.classList.add('selected');
        }
    }

    function update () {
        return removeTriplets().then(function (updatedBoard) {
            board = updatedBoard;
            if (boardHasChanged) {
                return update();
            } else {
                if (gameBegun && score >= 100) {
                    nextLesson();
                }
            }
        });
    }

    function swap (swappee, swapper) {
        var x = swappee.x,
            y = swappee.y;
        if (!areSwappable(swappee, swapper)) {
            return;
        }
        swappee.x = swapper.x;
        swappee.y = swapper.y;
        swapper.x = x;
        swapper.y = y;
        board[swappee.x][swappee.y] = swappee;
        board[swapper.x][swapper.y] = swapper;
        setTransformation(swappee);
        setTransformation(swapper);
    }

    function areSwappable (swappee, swapper) {
        return (Math.abs(swappee.x - swapper.x) === 1 && swappee.y === swapper.y) ||
            (Math.abs(swappee.y - swapper.y) === 1 && swappee.x === swapper.x);
    }

    var boardHasChanged;
    function removeTriplets () {
        return Promise.all(board.map(function (column) {
            return Promise.all(column.map(updateTile));
        })).then(function (boardWithSomeTilesRemoved) {
            boardHasChanged = false;
            return boardWithSomeTilesRemoved.map(function (column, x) {
                column = column.filter(function (tile) {
                    return tile !== undefined;
                });
                if (column.length !== rows.length) {
                    boardHasChanged = true;
                }
                return rows.slice(0, rows.length - column.length)
                           .map(function (y) {
                               return makeTile(x, -1);
                           })
                           .concat(column)
                           .map(function (tile, y) {
                               tile.x = x;
                               tile.y = y;
                               setTransformation(tile);
                               return tile;
                           });
            });
        });
    }

    function updateTile (tile) {
        if (isToBeCrushedVertically(tile) || isToBeCrushedHorizontally(tile)) {
            tile.classList.add('crushed');
            return wait(animationTime).then(function () {
                inscreaseScore();
                tile.remove();
                return undefined;
            });
        } else {
            return tile;
        }
    }

    function isToBeCrushedVertically (tile) {
        var combo = [0, 1, 2];
        return combo.some(function (comboOffset) {
            return combo.every(function (tileOffset) {
                try {
                    return board[tile.x][tile.y - comboOffset + tileOffset].type === board[tile.x][tile.y].type;
                } catch (e) {
                    return false;
                }
            });
        });
    }

    function isToBeCrushedHorizontally (tile) {
        var combo = [0, 1, 2];
        return combo.some(function (comboOffset) {
            return combo.every(function (tileOffset) {
                try {
                    return board[tile.x - comboOffset + tileOffset][tile.y].type === board[tile.x][tile.y].type;
                } catch (e) {
                    return false;
                }
            });
        });
    }

    function wait (time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }
})();

import React from 'react';
import './Matching.css';

interface GameItem {
    itemNo: number;
    matchNo: number;
    src: string;
    type: 'item' | 'bomb';
    matched: boolean;
    selecting: boolean;
}

const initialItems: GameItem[] = [
    { itemNo: 1, matchNo: 1, src: 'src/assets/Ben_10_Upchuck.png', type: 'item', matched: false, selecting: false },
    { itemNo: 2, matchNo: 2, src: 'src/assets/Ben_10.jpg', type: 'item', matched: false, selecting: false },
    { itemNo: 3, matchNo: 3, src: 'src/assets/VHGhA7q8_400x400.jpeg', type: 'item', matched: false, selecting: false },
    { itemNo: 4, matchNo: 4, src: '/images/lettuce.png', type: 'item', matched: false, selecting: false },
    { itemNo: 5, matchNo: 5, src: '/images/meat.png', type: 'item', matched: false, selecting: false },
    { itemNo: 6, matchNo: 6, src: '/images/rice.png', type: 'item', matched: false, selecting: false },
    { itemNo: 7, matchNo: 7, src: '/images/soup.png', type: 'item', matched: false, selecting: false },
    { itemNo: 8, matchNo: 8, src: '/images/bomb.png', type: 'bomb', matched: false, selecting: false },
    { itemNo: 9, matchNo: 1, src: 'src/assets/Ben_10_Upchuck.png', type: 'item', matched: false, selecting: false },
    { itemNo: 10, matchNo: 2, src: 'src/assets/Ben_10.jpg', type: 'item', matched: false, selecting: false },
    { itemNo: 11, matchNo: 3, src: '/images/cheese.png', type: 'item', matched: false, selecting: false },
    { itemNo: 12, matchNo: 4, src: '/images/lettuce.png', type: 'item', matched: false, selecting: false },
    { itemNo: 13, matchNo: 5, src: '/images/meat.png', type: 'item', matched: false, selecting: false },
    { itemNo: 14, matchNo: 6, src: '/images/rice.png', type: 'item', matched: false, selecting: false },
    { itemNo: 15, matchNo: 7, src: '/images/soup.png', type: 'item', matched: false, selecting: false },
    { itemNo: 16, matchNo: 8, src: '/images/bomb.png', type: 'bomb', matched: false, selecting: false }
];

interface MatchingState {
    selectingFirstNo: number | null;
    selectingSecondNo: number | null;
    selectFirst: boolean;
    items: GameItem[];
    life: number;
    canPress: number;
    left: number;
    status: 'playing' | 'win' | 'lose';
}

export default class Matching extends React.Component<{}, MatchingState> {
    audio!: HTMLAudioElement;

    state: MatchingState = {
        selectingFirstNo: null,
        selectingSecondNo: null,
        selectFirst: false,
        items: [],
        life: 4,
        canPress: 50,
        left: 0,
        status: 'playing',
    };

    componentDidMount() {
        this.startGame();
        this.audio = new Audio('src/assets/BEN10 DJ MOD REMIX.mp3');
        this.audio.loop = true;
        this.audio.play();
    }

    componentWillUnmount() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    startGame() {
        const resetItems = initialItems.map(item => ({
            ...item,
            matched: false,     // Reset matched status
            selecting: false,   // Reset selecting status
        }));

        this.setState({
            items: this.shuffle(resetItems),
            left: this.countItems(resetItems) / 3,
            life: 4,
            canPress: 50,
            status: 'playing',
            selectFirst: false,
            selectingFirstNo: null,
            selectingSecondNo: null,
        });
    }

    handleReset = () => {
        this.startGame();  // เรียกใช้ startGame เพื่อเริ่มเกมใหม่
    };

    shuffle(array: GameItem[]): GameItem[] {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    countItems(array: GameItem[]): number {
        return array.filter(item => item.type === 'item').length;
    }

    selectItem = (itemNo: number) => {
        const items = [...this.state.items];
        const selectedItem = items.find(item => item.itemNo === itemNo);

        if (selectedItem && !selectedItem.matched && !selectedItem.selecting) {
            this.setState({ canPress: this.state.canPress - 1 }, () => {
                // Check if canPress is below 0 to set the game to lose
                if (this.state.canPress < 0) {
                    this.setState({ status: 'lose' });
                }
            });

            if (selectedItem.type === 'bomb') {
                this.handleBombSelection(items.indexOf(selectedItem));
            } else {
                this.handleItemSelection(items.indexOf(selectedItem));
            }
        }
    };

    handleBombSelection(i: number) {
        let items = [...this.state.items];
        items[i].selecting = true;
        this.setState({ items, life: this.state.life - 1 }, () => {
            if (this.state.life === 0) {
                this.setState({ status: 'lose' }); // Set game to lose when life reaches 0
            }
        });
        setTimeout(() => {
            items[i].selecting = false;
            this.setState({ items });
        }, 750);
    }

    handleItemSelection(i: number) {
        let items = [...this.state.items];
        if (!this.state.selectFirst) {
            items[i].selecting = true;
            this.setState({ items, selectFirst: true });
        } else {
            items.forEach((item, i1) => {
                if (item.selecting && item.itemNo !== items[i].itemNo) {
                    if (items[i].matchNo === item.matchNo) {
                        this.handleMatch(i, i1);
                    } else {
                        this.handleMismatch(i, i1);
                    }
                }
            });
        }
    }

    handleMatch(i: number, i1: number) {
        let items = [...this.state.items];
        items[i].matched = true;
        items[i1].matched = true;
        items[i].selecting = false;
        items[i1].selecting = false;

        this.setState({ items, left: this.state.left - 1, selectFirst: false }, () => {
            if (this.state.left === 0) {
                this.setState({ status: 'win' });
            }
        });
    }

    handleMismatch(i: number, i1: number) {
        let items = [...this.state.items];
        items[i].selecting = true;
        this.setState({ items, selectFirst: false });

        setTimeout(() => {
            items[i].selecting = false;
            items[i1].selecting = false;
            this.setState({ items });
        }, 750);
    }

    renderLife() {
        let hearts = [];
        for (let i = 0; i < this.state.life; i++) {
            hearts.push(
                <img key={i} src="src/assets/heart.png" alt="life" style={{ width: 32, height: 32, marginRight: 10 }} />
            );
        }
        return <div style={{ display: 'flex', flexDirection: 'row' }}>{hearts}</div>;
    }

    render() {
        return (
            <div className="game-container">
                <div className="life-container">
                    {this.renderLife()}
                    <span style={{ fontSize: '32px' }}>{this.state.canPress}</span>
                </div>
    
                <div className="item-grid">
                    {this.state.items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => this.selectItem(item.itemNo)}
                            className={`item ${item.matched ? 'matched' : ''} ${item.selecting ? 'selecting' : ''}`}
                        >
                            {item.matched || item.selecting ? (
                                <img src={item.src} alt={item.type} className="item-img" /> // ใช้คลาส css ในการตั้งค่า style
                            ) : (
                                <img src="src/assets/question.png" alt="question" className="item-img" />
                            )}
                        </div>
                    ))}
                </div>
    
                {this.state.status === 'lose' && (
                    <div className="game-over">
                        <h1>Game Over!</h1>
                        <button onClick={this.handleReset}>Restart</button>
                    </div>
                )}
    
                {this.state.status === 'win' && (
                    <div className="game-over">
                        <h1>You Win!</h1>
                        <button onClick={this.handleReset}>Restart</button>
                    </div>
                )}
            </div>
        );
    }
}

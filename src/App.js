import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
// import $ from 'jquery';
/*
点击一个方块时，发生了什么？
1、Square 组件的 onClick 事件处理函数触发
2、Square 组件从Board通过onSquareClick props接收到该函数
3、Board 组件的 handleClick 函数被调用
4、Board 组件调用 setState() 更新 squares 数组
5、Board 组件的squares state更新， Board 及其所有子组件重新渲染
6、Square 组件接收到新的 value props
*/
function Square({value, onSquareClick}) {
  return(
    <button className='square' onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext,squares,remainSquares,onPlay,resetBoard}) {

  const [winner,winningLine] = calculateWinner(squares);
  console.log(winner,winningLine);
  let status,statusColor,winnerLineColor;
  // 判断是否有一方胜出
  if (winner) {
    status = 'Winner : ' + winner;
    statusColor = 'green';
    //改变胜出方的背景色
    winningLine.forEach((index)=>{
      // document.getElementsByClassName('square')[index].style.backgroundColor = winnerLineColor;
      //用js的方式添加样式
      document.getElementsByClassName('square')[index].classList.add('winningClass');
    })
  }else {
    status = 'Next player : ' + (xIsNext ? 'X' : 'O');
    statusColor = 'black';
    // 将所有方块背景色恢复为白色
    // 如果square组件存在
    if (document.getElementsByClassName('square')[0])
    {
      for (let i = 0; i < 9; i++) {
        //如果winningClass类存在
        if (document.getElementsByClassName('square')[i].classList.contains('winningClass'))
          document.getElementsByClassName('square')[i].classList.remove('winningClass');
      }
    }
  }
  // 判断是否平局
  if (remainSquares === 0 ) {
    status = 'Tie';
    statusColor = 'red';
  }
  function handleClick(i) {
    //判断当前点击的方块是否已经被填充 以及 是否已经有一方胜出
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();// 为了不直接修改原数组，调用 .slice() 方法创建了一个副本
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
    console.log(remainSquares);
  }
  return (
    // 构建九宫格棋盘
    <>
      <div className='tic-tac-toe'>
        <div className='status' style={{color: statusColor}}>{status}</div>
        <div className='board-row'>
          <Square value={squares[0]} onSquareClick={()=> handleClick(0)}/>
          <Square value={squares[1]} onSquareClick={()=> handleClick(1)}/>
          <Square value={squares[2]} onSquareClick={()=> handleClick(2)}/>
        </div>
        <div className='board-row'>
          <Square value={squares[3]} onSquareClick={()=> handleClick(3)}/>
          <Square value={squares[4]} onSquareClick={()=> handleClick(4)}/>
          <Square value={squares[5]} onSquareClick={()=> handleClick(5)}/>
        </div>
        <div className='board-row'>
          <Square value={squares[6]} onSquareClick={()=> handleClick(6)}/>
          <Square value={squares[7]} onSquareClick={()=> handleClick(7)}/>
          <Square value={squares[8]} onSquareClick={()=> handleClick(8)}/>
        </div>
        <div>
          <button className='functionButton' onClick={()=> resetBoard()}>Reset</button>
        </div>
      </div>
    </>
  )

  //判断游戏胜负
  function calculateWinner(squares) {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8], // 横向
      [0,3,6], [1,4,7], [2,5,8], // 纵向
      [0,4,8], [2,4,6] // 斜向
    ];
    for (let i = 0; i < lines.length; i++){
      const [a,b,c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return [squares[a],lines[i]];
      }
    }
    return [null,null];
  }
}

export default function Game() {
  const [history,setHistory] = useState([Array(9).fill(null)]);//存储历史状态
  const [currentMove, setCurrentMove] = useState(0);//存储当前步数
  const xIsNext = currentMove % 2 === 0;
  const remainSquares = 9 - currentMove;
  const currentSquare = history[currentMove];//存储当前棋盘状态
  let tmpMove = currentMove;

  // 处理每一步棋
  function handlePlay(nextSquares){
    const newHistory = [...history.slice(0,currentMove+1),nextSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }
  // 重置棋盘
  function resetBoard() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // 回溯功能
  function jumpTo(nextMove) {
    if (nextMove < 0 || nextMove > 9 ) return;
    setCurrentMove(nextMove);
  }
  // 悔棋功能
  function handleUndo(nextMove) {
    if (nextMove >= 0) {
      setCurrentMove(nextMove);
      //删除当前步历史记录
      const newHistory = history.slice(0,nextMove+1);
     setHistory(newHistory);
    }

  }

  // 生成历史记录列表
  const moves = history.map((squares,move) => { // map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
    let description,movePosition;
    let row,col;
    console.log(squares);
    if (move>0) {
      description = 'Go to move #' + move;
      //第move步棋的位置
      for (let i = 0; i < 9; i++) {
        if (history[move][i] !== history[move-1][i]) {
          movePosition = i;
          break;
        }
      }
      //把位置转换成坐标
      row = Math.floor(movePosition / 3) + 1;
      col = movePosition % 3 + 1;
      //第move步棋的符号
      description += ' '+ history[move][movePosition]+'(' + row + ',' + col + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={()=> jumpTo(move)}>{description}</button>
      </li>
    )
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquare} remainSquares={remainSquares} onPlay={handlePlay} resetBoard={resetBoard}/>
              {/* 悔棋按钮 */}
       <button className='functionButton' style={{position:'absolute',top:'62%',left:'40%'}} onClick={()=> handleUndo(currentMove-1)}>Go back</button>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
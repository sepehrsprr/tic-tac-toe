from django.shortcuts import render
from django.http import JsonResponse

def index(request):
    return render(request, 'tic_tac_toe/index.html')

def make_move(request):
    if request.method == 'POST':
        board = request.POST.getlist('board[]')  # Get current board state
        move = int(request.POST.get('move'))     # Get player's move
        player = request.POST.get('player')      # Get current player ('X' or 'O')

        # Update the board with the player's move
        if board[move] == '':  # Ensure the cell is empty
            board[move] = player

        # Check for a winner
        winner = check_winner(board)
        is_draw = '' not in board  # Check if the board is full

        # Determine the next player
        next_player = 'O' if player == 'X' else 'X'

        response_data = {
            'board': board,
            'winner': winner,
            'draw': is_draw,
            'nextPlayer': next_player,
        }
        return JsonResponse(response_data)

def check_winner(board):
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
        [0, 4, 8], [2, 4, 6]              # Diagonals
    ]
    for combo in winning_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] != '':
            return board[combo[0]]
    return None
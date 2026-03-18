import java.util.Scanner;
import java.util.Random;

public class TicTacToe {

    public static void main(String[] args) {
        Scanner gameMaster = new Scanner(System.in);
        char[][] gameBoard = new char[3][3];

        System.out.println("Welcome to Tic Tac Toe!");

        while (true){
            System.out.println("""
                Game mode:
                > Manual - Press 1
                > AI - Press 2
                """);
            int gameMode = gameMaster.nextInt();

            if(gameMode == 1) {
                setManualBoard(gameBoard);
            } else if (gameMode ==2) {
                setAIBoard(gameBoard);
            } else {
                System.out.println("Invalid game mode. Try Again!");
                continue;
            }

            System.out.println("Here's the board:");
            printBoard(gameBoard);
            
            System.out.println("Here's an inverse of the board:");
            printBoard(inverseBoard(gameBoard));
            break;
        }


    }

    private static void setManualBoard(char[][] gameBoard) {
        System.out.println("Please enter the first row of the moves: ");
        gameBoard[0] = fetchRow();

        System.out.println("Please enter the second row of the moves: ");
        gameBoard[1] = fetchRow();

        System.out.println("Please enter the third row of the moves: ");
        gameBoard[2] = fetchRow();
    } 

    private static char[] fetchRow() {
        Scanner gameMaster = new Scanner(System.in);

        while(true){
            String row = gameMaster.nextLine();
          try{
              return separateComma(row);
          }
            catch( IllegalArgumentException e) {
                System.out.println("""
                        Invalid row. Try Again!
                        Example Output: X,O,X
                        """);
            }
        }
    }
    private static void setAIBoard(char[][] gameBoard) {
        Random random = new Random();
        char[] possibleSelections = {'X', 'O'};

        for (int i = 0; i < gameBoard.length; i++) {
            for (int j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = possibleSelections[random.nextInt(possibleSelections.length)];
            }
        }
    }
    
    private static char[][] inverseBoard(char[][] gameBoard) {
        char[][] binaryOutput = new char[gameBoard.length][gameBoard[0].length];
        for (int i = 0; i < gameBoard.length; i++) {
            for (int j = 0; j < gameBoard[i].length; j++) {
                binaryOutput[i][j] = inverse(gameBoard[i][j]);
            }
        }
        return binaryOutput;
    }

    

    private static void printBoard(char[][] board) {
        for (var ints : board) {
            for (int j = 0; j < ints.length; j++) {
                System.out.print(ints[j]);

                if (j < ints.length - 1) {
                    System.out.print(",");
                }
            }
            System.out.println();
        }
    }

    private static char inverse(char value) {
        if (value == 'X' || value == 'x') return '1';
        if (value == 'O' || value == 'o') return '0';
        throw new IllegalArgumentException("Invalid value: " + value);
    }
    
    private static char[] separateComma(String set) {
        String[] parts = set.split(",");
        char[] result = new char[parts.length];

        for (int i = 0; i < parts.length; i++) {
            result[i] = parts[i].trim().charAt(0);
        }

        for(String part : parts){
            if(part.trim().charAt(0) != 'X' && part.trim().charAt(0) != 'O'){
                throw new IllegalArgumentException("Invalid row. Try Again!");
            }
        }
        
        return result;
    }
}

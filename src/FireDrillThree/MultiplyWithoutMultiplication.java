import java.util.Scanner;

public class MultiplyWithoutMultiplication {

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.println("""
        ===============================================
            Welcome to the Magic of Mathematics
        ===============================================
        """);

        System.out.print("What's the first number you'd like to multiply? ");
        int firstNum = input.nextInt();

        System.out.print("What's the second number you'd like to multiply? ");
        int secondNum = input.nextInt();

        int result = multiply(firstNum, secondNum);

        System.out.println("Result: " + result);

        input.close();
    }

    private static int multiply(int a, int b) {
        int result = 0;

        for (int i = 0; i < Math.abs(b); i++) {
            result += a;
        }

        if (b < 0) {
            result = -result;
        }

        return result;
    }
}
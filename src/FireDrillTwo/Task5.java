import java.util.Scanner;

public class Task5 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int i = 0;

        while (i < 10) {
            System.out.print("Enter score: ");
            int score = scanner.nextInt();
            if (score % 2 == 0) {
                sum += score;
            }
            i++;
        }

        System.out.println("Sum of even numbers: " + sum);
        scanner.close();
    }
}

import java.util.Scanner;

public class Task8 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int i = 0;

        while (i < 10) {
            System.out.print("Enter score (0-100): ");
            int score = scanner.nextInt();
            if (score >= 0 && score <= 100) {
                sum += score;
                i++;
            } else {
                System.out.println("Invalid score. Try again.");
            }
        }

        System.out.println("Sum: " + sum);
        scanner.close();
    }
}

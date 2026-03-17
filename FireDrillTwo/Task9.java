import java.util.Scanner;

public class Task9 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int i = 0;

        while (i < 10) {
            System.out.print("Enter score: ");
            int score = scanner.nextInt();
            if (score >= 0 && score <= 100) {
                sum += score;
            }
            i++;
        }

        System.out.println("Sum of valid scores: " + sum);
        scanner.close();
    }
}

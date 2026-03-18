import java.util.Scanner;

public class Task10 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int count = 0;
        int i = 0;

        while (i < 10) {
            System.out.print("Enter score: ");
            int score = scanner.nextInt();
            if (score >= 0 && score <= 100) {
                sum += score;
                count++;
            }
            i++;
        }

        if (count > 0) {
            System.out.println("Average of valid scores: " + (sum / (double) count));
        } else {
            System.out.println("No valid scores entered.");
        }
        scanner.close();
    }
}

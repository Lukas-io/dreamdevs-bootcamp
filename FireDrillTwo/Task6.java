import java.util.Scanner;

public class Task6 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int count = 0;
        int i = 0;

        while (i < 10) {
            System.out.print("Enter score: ");
            int score = scanner.nextInt();
            if (score % 2 == 0) {
                sum += score;
                count++;
            }
            i++;
        }

        if (count > 0) {
            System.out.println("Average of even numbers: " + (sum / (double) count));
        } else {
            System.out.println("No even numbers entered.");
        }
        scanner.close();
    }
}

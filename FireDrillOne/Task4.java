import java.util.Scanner;

public class Task4 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int i = 0;

        while (i < 10) {
            System.out.print("Enter score " + (i + 1) + ": ");
            int score = scanner.nextInt();
            if (i % 2 != 0) {
                sum += score;
            }
            i++;
        }

        System.out.println("Sum of even positions (2nd,4th,...10th): " + sum);
        scanner.close();
    }
}

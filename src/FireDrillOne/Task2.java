import java.util.Scanner;

public class Task2 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int i = 0;

        while (i < 10) {
            System.out.print("Enter score: ");
            sum += scanner.nextInt();
            i++;
        }

        System.out.println("Average: " + (sum / 10.0));
        scanner.close();
    }
}

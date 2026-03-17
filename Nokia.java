import java.util.Scanner;

public class Nokia {
    static Scanner input = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("""
                ================================
                     Welcome to Nokia 3310
                       Your Reliable Phone
                ================================
                """);

        String mainMenu = """
                1.  Phone Book
                2.  Messages
                3.  Chat
                4.  Call Register
                5.  Tones
                6.  Settings
                7.  Call Divert
                8.  Games
                9.  Calculator
                10. Reminders
                11. Clock
                12. Profiles
                13. SIM Services
                """;

        System.out.println(mainMenu);
        int choice = input.nextInt();

        switch (choice) {
            case 1 -> phoneBook();
            case 2 -> messages();
            case 3 -> System.out.println("Opening Chat...");
            case 4 -> callRegister();
            case 5 -> tones();
            case 6 -> settings();
            case 7 -> System.out.println("Opening Call Divert...");
            case 8 -> System.out.println("Opening Games...");
            case 9 -> System.out.println("Opening Calculator...");
            case 10 -> System.out.println("Opening Reminders...");
            case 11 -> clock();
            case 12 -> System.out.println("Opening Profiles...");
            case 13 -> System.out.println("Opening SIM Services...");
            default -> System.out.println("Invalid option.");
        }

        input.close();
    }

    static void phoneBook() {
        System.out.println("""
                -- Phone Book --
                1. Search
                2. Service Nos.
                3. Add Name
                4. Erase
                5. Edit
                6. Assign Tone
                7. Send B'card
                8. Options
                9. Speed Dials
                10. Voice Tags
                """);
        int choice = input.nextInt();

        switch (choice) {
            case 1 -> System.out.println("Searching...");
            case 2 -> System.out.println("Service Numbers...");
            case 3 -> System.out.println("Add Name...");
            case 4 -> System.out.println("Erase contact...");
            case 5 -> System.out.println("Edit contact...");
            case 6 -> System.out.println("Assign Tone...");
            case 7 -> System.out.println("Send B'card...");
            case 8 -> {
                System.out.println("""
                        -- Options --
                        1. Type of View
                        2. Memory Status
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> System.out.println("Type of View...");
                    case 2 -> System.out.println("Memory Status...");
                    default -> System.out.println("Invalid option.");
                }
            }
            case 9 -> System.out.println("Speed Dials...");
            case 10 -> System.out.println("Voice Tags...");
            default -> System.out.println("Invalid option.");
        }
    }

    static void messages() {
        System.out.println("""
                -- Messages --
                1.  Write Messages
                2.  Inbox
                3.  Outbox
                4.  Picture Messages
                5.  Templates
                6.  Smileys
                7.  Message Settings
                8.  Info Service
                9.  Voice Mailbox Number
                10. Service Command Editor
                """);
        int choice = input.nextInt();

        switch (choice) {
            case 1 -> System.out.println("Write Messages...");
            case 2 -> System.out.println("Opening Inbox...");
            case 3 -> System.out.println("Opening Outbox...");
            case 4 -> System.out.println("Picture Messages...");
            case 5 -> System.out.println("Templates...");
            case 6 -> System.out.println("Smileys...");
            case 7 -> {
                System.out.println("""
                        -- Message Settings --
                        1. Set 1
                        2. Common
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> {
                        System.out.println("""
                                -- Set 1 --
                                1. Message Centre Number
                                2. Messages Sent As
                                3. Message Validity
                                """);
                        int sub2 = input.nextInt();
                        switch (sub2) {
                            case 1 -> System.out.println("Message Centre Number...");
                            case 2 -> System.out.println("Messages Sent As...");
                            case 3 -> System.out.println("Message Validity...");
                            default -> System.out.println("Invalid option.");
                        }
                    }
                    case 2 -> {
                        System.out.println("""
                                -- Common --
                                1. Delivery Reports
                                2. Reply Via Same Centre
                                3. Character Support
                                """);
                        int sub2 = input.nextInt();
                        switch (sub2) {
                            case 1 -> System.out.println("Delivery Reports...");
                            case 2 -> System.out.println("Reply Via Same Centre...");
                            case 3 -> System.out.println("Character Support...");
                            default -> System.out.println("Invalid option.");
                        }
                    }
                    default -> System.out.println("Invalid option.");
                }
            }
            case 8 -> System.out.println("Info Service...");
            case 9 -> System.out.println("Voice Mailbox Number...");
            case 10 -> System.out.println("Service Command Editor...");
            default -> System.out.println("Invalid option.");
        }
    }

    static void callRegister() {
        System.out.println("""
                -- Call Register --
                1. Missed Calls
                2. Received Calls
                3. Dialled Numbers
                4. Erase Recent Call Lists
                5. Show Call Duration
                6. Show Call Costs
                7. Call Cost Settings
                8. Prepaid Credit
                """);
        int choice = input.nextInt();

        switch (choice) {
            case 1 -> System.out.println("Missed Calls...");
            case 2 -> System.out.println("Received Calls...");
            case 3 -> System.out.println("Dialled Numbers...");
            case 4 -> System.out.println("Erasing recent call lists...");
            case 5 -> {
                System.out.println("""
                        -- Show Call Duration --
                        1. Last Call Duration
                        2. All Calls' Duration
                        3. Received Calls' Duration
                        4. Dialled Calls' Duration
                        5. Clear Timers
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> System.out.println("Last Call Duration...");
                    case 2 -> System.out.println("All Calls' Duration...");
                    case 3 -> System.out.println("Received Calls' Duration...");
                    case 4 -> System.out.println("Dialled Calls' Duration...");
                    case 5 -> System.out.println("Timers cleared.");
                    default -> System.out.println("Invalid option.");
                }
            }
            case 6 -> {
                System.out.println("""
                        -- Show Call Costs --
                        1. Last Call Cost
                        2. All Calls' Cost
                        3. Clear Counters
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> System.out.println("Last Call Cost...");
                    case 2 -> System.out.println("All Calls' Cost...");
                    case 3 -> System.out.println("Counters cleared.");
                    default -> System.out.println("Invalid option.");
                }
            }
            case 7 -> {
                System.out.println("""
                        -- Call Cost Settings --
                        1. Call Cost Limit
                        2. Show Costs In
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> System.out.println("Call Cost Limit...");
                    case 2 -> System.out.println("Show Costs In...");
                    default -> System.out.println("Invalid option.");
                }
            }
            case 8 -> System.out.println("Prepaid Credit...");
            default -> System.out.println("Invalid option.");
        }
    }

    static void tones() {
        System.out.println("""
                -- Tones --
                1. Ringing Tone
                2. Ringing Volume
                3. Incoming Call Alert
                4. Composer
                5. Message Alert Tone
                6. Keypad Tones
                7. Warning and Game Tones
                8. Vibrating Alert
                9. Screen Saver
                """);
        int choice = input.nextInt();

        switch (choice) {
            case 1 -> System.out.println("Ringing Tone...");
            case 2 -> System.out.println("Ringing Volume...");
            case 3 -> System.out.println("Incoming Call Alert...");
            case 4 -> System.out.println("Composer...");
            case 5 -> System.out.println("Message Alert Tone...");
            case 6 -> System.out.println("Keypad Tones...");
            case 7 -> System.out.println("Warning and Game Tones...");
            case 8 -> System.out.println("Vibrating Alert...");
            case 9 -> System.out.println("Screen Saver...");
            default -> System.out.println("Invalid option.");
        }
    }

    static void settings() {
        System.out.println("""
                -- Settings --
                1. Call Settings
                2. Phone Settings
                3. Security Settings
                4. Restore Factory Settings
                """);
        int choice = input.nextInt();

        switch (choice) {
            case 1 -> {
                System.out.println("""
                        -- Call Settings --
                        1. Automatic Redial
                        2. Speed Dialling
                        3. Call Waiting Options
                        4. Own Number Sending
                        5. Phone Line in Use
                        6. Automatic Answer
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> System.out.println("Automatic Redial...");
                    case 2 -> System.out.println("Speed Dialling...");
                    case 3 -> System.out.println("Call Waiting Options...");
                    case 4 -> System.out.println("Own Number Sending...");
                    case 5 -> System.out.println("Phone Line in Use...");
                    case 6 -> System.out.println("Automatic Answer...");
                    default -> System.out.println("Invalid option.");
                }
            }
            case 2 -> {
                System.out.println("""
                        -- Phone Settings --
                        1. Language
                        2. Cell Info Display
                        3. Welcome Note
                        4. Network Selection
                        5. Lights
                        6. Confirm SIM Service Actions
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> System.out.println("Language...");
                    case 2 -> System.out.println("Cell Info Display...");
                    case 3 -> System.out.println("Welcome Note...");
                    case 4 -> System.out.println("Network Selection...");
                    case 5 -> System.out.println("Lights...");
                    case 6 -> System.out.println("Confirm SIM Service Actions...");
                    default -> System.out.println("Invalid option.");
                }
            }
            case 3 -> {
                System.out.println("""
                        -- Security Settings --
                        1. PIN Code Request
                        2. Call Barring Service
                        3. Fixed Dialling
                        4. Closed User Group
                        5. Phone Security
                        6. Change Access Codes
                        """);
                int sub = input.nextInt();
                switch (sub) {
                    case 1 -> System.out.println("PIN Code Request...");
                    case 2 -> System.out.println("Call Barring Service...");
                    case 3 -> System.out.println("Fixed Dialling...");
                    case 4 -> System.out.println("Closed User Group...");
                    case 5 -> System.out.println("Phone Security...");
                    case 6 -> System.out.println("Change Access Codes...");
                    default -> System.out.println("Invalid option.");
                }
            }
            case 4 -> System.out.println("Restoring factory settings...");
            default -> System.out.println("Invalid option.");
        }
    }

    static void clock() {
        System.out.println("""
                -- Clock --
                1. Alarm Clock
                2. Clock Settings
                3. Date Setting
                4. Stopwatch
                5. Countdown Timer
                6. Auto Update of Date and Time
                """);
        int choice = input.nextInt();

        switch (choice) {
            case 1 -> System.out.println("Alarm Clock...");
            case 2 -> System.out.println("Clock Settings...");
            case 3 -> System.out.println("Date Setting...");
            case 4 -> System.out.println("Stopwatch...");
            case 5 -> System.out.println("Countdown Timer...");
            case 6 -> System.out.println("Auto Update of Date and Time...");
            default -> System.out.println("Invalid option.");
        }
    }
}

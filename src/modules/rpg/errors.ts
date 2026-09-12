export function rpgErrorMessage(error: unknown, fallback = "The signal faltered.") {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message: unknown }).message);
    if (message.includes("Quest title required") || message.includes("Task title required")) {
      return "Enter a task name.";
    }
    if (message.includes("Name the codex") || message.includes("List name required")) {
      return "Enter a list name.";
    }
    if (message.includes("Name the chapter") || message.includes("Group name required")) {
      return "Enter a group name.";
    }
    if (message.includes("Task not found") || message.includes("Quest not found")) {
      return "That task is gone. Refresh the board and try again.";
    }
    if (message.includes("List not found") || message.includes("Codex not found")) {
      return "That list is gone. Refresh the board and try again.";
    }
    if (message.includes("Group not found")) {
      return "That group is gone. Refresh the board and try again.";
    }
    if (message.includes("already restored")) {
      return "That task is already completed.";
    }
    if (message.includes("Not enough shards")) {
      return "Not enough aether shards.";
    }
    if (message.includes("Already claimed")) {
      return "This relic already hangs in your vault.";
    }
    if (message.includes("Invalid login")) {
      return "Those credentials do not match a bound traveler.";
    }
    if (message.includes("User already registered")) {
      return "This signal is already bound. Return instead.";
    }
    if (message.trim()) {
      return message;
    }
  }
  return fallback;
}

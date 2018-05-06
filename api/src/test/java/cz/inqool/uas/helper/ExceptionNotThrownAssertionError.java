package cz.inqool.uas.helper;

public class ExceptionNotThrownAssertionError extends AssertionError {
    public ExceptionNotThrownAssertionError() {
        super("Expected exception was not thrown.");
    }
}

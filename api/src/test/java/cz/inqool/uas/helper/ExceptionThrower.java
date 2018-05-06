package cz.inqool.uas.helper;

@FunctionalInterface
public interface ExceptionThrower {
    void throwException() throws Throwable;
}

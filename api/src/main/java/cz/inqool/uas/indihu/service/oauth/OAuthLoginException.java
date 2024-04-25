package cz.inqool.uas.indihu.service.oauth;

import lombok.Getter;

@Getter
public class OAuthLoginException extends RuntimeException {

    private final ErrorCode errorCode;

    public OAuthLoginException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public OAuthLoginException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public enum ErrorCode {
        REGISTRATION_NOT_ALLOWED,
        MISSING_EMAIL,
        BAD_REQUEST,
        NO_ACCESS_TOKEN,
        NO_PROVIDER,
        AWAITING_ADMIN_APPROVAL
    }
}

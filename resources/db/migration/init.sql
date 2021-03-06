CREATE DATABASE IF NOT EXISTS swordhealthapp DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS swordhealthapp.APP_USER (
    ID          BIGINT			UNSIGNED NOT NULL AUTO_INCREMENT,
    ACTIVE      BOOLEAN         NOT NULL DEFAULT TRUE,
    USERNAME    VARCHAR(127)    NOT NULL UNIQUE,
    PASSWORD    VARCHAR(255)    NOT NULL,
	TYPE		CHAR(1)			NOT NULL,
    -- KEYS AND CONSTRAINTS
    PRIMARY KEY (ID)
) ENGINE=INNODB DEFAULT CHARACTER SET UTF8MB4;

CREATE TABLE IF NOT EXISTS swordhealthapp.APP_TASK (
    ID          BIGINT			UNSIGNED NOT NULL AUTO_INCREMENT,
    DESCRIPTION VARCHAR(2500)   NOT NULL,
    CREATION    TIMESTAMP       NOT NULL,
    LAST_UPDATE TIMESTAMP       NOT NULL,
	USER_ID		BIGINT			UNSIGNED NOT NULL,
    -- KEYS AND CONSTRAINTS
    PRIMARY KEY (ID),
	FOREIGN KEY (USER_ID) REFERENCES APP_USER(ID) ON DELETE RESTRICT
) ENGINE=INNODB DEFAULT CHARACTER SET UTF8MB4;

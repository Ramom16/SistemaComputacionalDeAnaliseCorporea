-- Remove o DEFAULT CURRENT_TIMESTAMP de `usado_em`: o token deve nascer válido
-- e só ser marcado como usado explicitamente por marcarComoUsado.
ALTER TABLE `email_verification_tokens`
    MODIFY `usado_em` DATETIME(3) NULL DEFAULT NULL;

ALTER TABLE `password_reset_tokens`
    MODIFY `usado_em` DATETIME(3) NULL DEFAULT NULL;

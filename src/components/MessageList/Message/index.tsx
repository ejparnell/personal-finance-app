import Image from 'next/image';
import successIcon from '@/assets/icon-success.svg';
import errorIcon from '@/assets/icon-error.svg';
import infoIcon from '@/assets/icon-info.svg';
import warningIcon from '@/assets/icon-warning.svg';
import closeIcon from '@/assets/icon-close.svg';
import presets from '@/styles/presets.module.css';
import styles from './Message.module.css';

interface MessageProps {
    content: string;
    type: string;
    handleClose: () => void;
}

export default function Message({ content, type, handleClose }: MessageProps) {
    const iconSize = 80;
    const closeButtonSize = 24;

    function formatIcon(type: string) {
        switch (type) {
            case 'success':
                return successIcon;
            case 'error':
                return errorIcon;
            case 'info':
                return infoIcon;
            case 'warning':
                return warningIcon;
            default:
                return infoIcon;
        }
    }

    function formatTitle(type: string) {
        switch (type) {
            case 'success':
                return 'SUCCESS!';
            case 'error':
                return 'ERROR!';
            case 'info':
                return 'INFO!';
            case 'warning':
                return 'WARNING!';
            default:
                return 'MESSAGE!';
        }
    }

    function formatContent(content: string) {
        const maxLength = 50;
        if (content.length > maxLength) {
            return content.slice(0, maxLength) + '...';
        }
        return content;
    }

    return (
        <div className={styles.messageWrapper}>
            <div className={`${styles.iconWrapper} ${styles[type]}`}>
                <Image
                    src={formatIcon(type)}
                    alt={`${type} icon`}
                    width={iconSize}
                    height={iconSize}
                />
            </div>

            <div className={styles.messageContent}>
                <h3 className={presets.fontSizeHeading}>{formatTitle(type)}</h3>

                <p className={presets.fontSizeCaption}>
                    {formatContent(content)}
                </p>
            </div>

            <button className={styles.closeButton} onClick={handleClose}>
                <Image
                    src={closeIcon}
                    alt="Close icon"
                    width={closeButtonSize}
                    height={closeButtonSize}
                    onClick={handleClose}
                />
            </button>
        </div>
    );
}

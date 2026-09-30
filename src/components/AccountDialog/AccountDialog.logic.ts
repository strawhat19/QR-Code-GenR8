import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../shared/AppContext';
import type { FormEvent, MouseEvent } from 'react';

export function useAccountDialog(onClose: () => void) {
    const { login, user } = useApp();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(user?.name ?? ``);
    const [email, setEmail] = useState(user?.email ?? ``);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
        nameRef.current?.focus();
        return () => { if (dialog?.open) dialog.close(); };
    }, []);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!name.trim() || !email.trim()) return;
        login(name.trim(), email.trim().toLowerCase());
        onClose();
    }

    function handleBackdrop(event: MouseEvent<HTMLDialogElement>) {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right
            || event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (outside) onClose();
    }

    return { name, email, nameRef, dialogRef, setName, setEmail, handleSubmit, handleBackdrop };
}

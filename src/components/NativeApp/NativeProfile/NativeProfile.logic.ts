import { useState } from 'react';
import { useApp } from '../../../shared/AppContext';

export function useNativeProfile(onClose: () => void) {
    const { login } = useApp();
    const [name, setName] = useState(``);
    const [email, setEmail] = useState(``);
    const [error, setError] = useState(``);

    function submit() {
        try {
            login(name, email);
            setError(``);
            onClose();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : `Enter your name and email to continue.`);
        }
    }

    return { name, email, error, submit, setName, setEmail };
}

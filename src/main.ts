import { debounce } from './helpers';
import './app.css';
import './spinner.css';

document.addEventListener('DOMContentLoaded', function () {
    const datosFormulario = {
        email: '',
        asunto: '',
        mensaje: '',
    };

    const inputEmail = document.querySelector('#email') as HTMLInputElement;
    const inputAsunto = document.querySelector('#asunto') as HTMLInputElement;
    const inputMensaje = document.querySelector(
        '#mensaje'
    ) as HTMLTextAreaElement;
    const formulario = document.querySelector('#formulario') as HTMLFormElement;
    const btnReset = document.querySelector(
        '#formulario button[type="reset"]'
    ) as HTMLButtonElement;

    inputEmail.addEventListener('input', debounce(validar, 500));
    inputAsunto.addEventListener('input', debounce(validar, 500));
    inputMensaje.addEventListener('input', debounce(validar, 500));
    formulario.addEventListener('submit', enviarFormulario);

    btnReset.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();

        reiniciarFormulario();
    });

    function validar(e: MouseEvent): void {
        const target = e.target as HTMLInputElement;

        if (target.value.trim() === '') {
            mostrarAlerta(target, `El campo ${target.name} es obligatorio.`);
            return;
        }

        if (target.name === 'email' && !validarEmail(target.value)) {
            mostrarAlerta(target, 'El email no es válido.');
            return;
        }

        limpiarAlerta(target.parentElement as HTMLDivElement);

        datosFormulario[target.name as keyof typeof datosFormulario] =
            target.value.trim().toLowerCase();

        comprobarDatosFormulario();
    }

    function mostrarAlerta(
        element: HTMLInputElement | HTMLTextAreaElement,
        mensaje: string
    ): void {
        const parentElement = element.parentElement as HTMLDivElement;
        limpiarAlerta(parentElement);

        const error: HTMLElement = document.createElement('P');

        error.textContent = mensaje;
        error.classList.add(
            'bg-red-600',
            'text-white',
            'p-2',
            'text-center',
            'error'
        );

        parentElement.appendChild(error);

        datosFormulario[element.name as keyof typeof datosFormulario] = '';

        comprobarDatosFormulario();
    }

    function limpiarAlerta(element: HTMLDivElement): void {
        const alerta = element.querySelector('.error') as HTMLParagraphElement;

        if (alerta) {
            alerta.remove();
        }
    }

    function validarEmail(email: string): boolean {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        return regex.test(email);
    }

    function comprobarDatosFormulario(): void {
        const btnSubmit = document.querySelector(
            '#formulario button[type="submit"]'
        ) as HTMLButtonElement;

        if (!Object.values(datosFormulario).includes('')) {
            btnSubmit.classList.remove('opacity-50');
            btnSubmit.disabled = false;

            return;
        }
        btnSubmit.classList.add('opacity-50');
        btnSubmit.disabled = true;
    }

    function reiniciarFormulario() {
        datosFormulario.email = '';
        datosFormulario.asunto = '';
        datosFormulario.mensaje = '';
        formulario.reset();

        comprobarDatosFormulario();
    }

    function enviarFormulario(e: Event): void {
        e.preventDefault();

        const spinner = document.querySelector('#spinner') as HTMLDivElement;

        spinner.classList.remove('hidden');

        setTimeout(() => {
            spinner.classList.add('hidden');
            reiniciarFormulario();

            const alertaExito: HTMLElement = document.createElement('P');

            alertaExito.classList.add(
                'bg-green-500',
                'text-white',
                'p-2',
                'text-center',
                'rounded-lg',
                'mt-10',
                'font-bold',
                'text-sm',
                'uppercase'
            );
            alertaExito.textContent = 'Mensaje enviado correctamente.';

            formulario.appendChild(alertaExito);

            setTimeout(() => {
                alertaExito.remove();
            }, 3000);
        }, 3000);
    }
});

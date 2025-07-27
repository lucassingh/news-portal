import React, { useCallback, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const quillRef = useRef<ReactQuill>(null);

    const handleLink = useCallback(() => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const range = editor.getSelection();
        if (!range) return;

        const href = prompt('Ingresa la URL del enlace');
        if (href === null) return;

        if (href) {
            editor.format('link', href);
        } else {
            editor.format('link', false);
        }
    }, []);

    const modules = React.useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }], // Alineación de texto
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
        },
        clipboard: {
            matchVisual: false,
        }
    }), [handleLink]);

    const formats = [
        'header', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'align',
        'list', 'bullet',
        'link', 'image'
    ];

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Escribe el contenido de la noticia aquí..."
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            />
        </div>
    );
};

export default RichTextEditor;
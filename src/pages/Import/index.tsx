import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    // validação
    if(!uploadedFiles.length) return;

    // somente 1
    const file = uploadedFiles[0];

    data.append('file', file.file, file.name);

    try {

      // envia o arquivo para o back-end
      await api.post('/transactions/import', data);
      
      // redireciona para a página desejada
      history.push('/');

    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {

    // formata os dados do arquivo
    const uploadFiles = files.map(file => ({
      file,  // short syntax
      name: file.name,
      readableSize: filesize(file.size),
    }))

    setUploadedFiles(uploadFiles);

  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;

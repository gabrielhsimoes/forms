import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }


  constructor(private http: HttpClient,
    private cepService: ConsultaCepService) { }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    console.log(form);

    // console.log(this.usuario);

    this.http.post('https://httpbin.org/post', JSON.stringify(form.value)).pipe(map(res => res)).subscribe(dados => console.log(dados));
  }

  verificaValidTouched(campo: any) {
    return !campo.valid && campo.touched;
  }

  aplicaCSSErro(campo: any) {
    return {
      'needs-validation': this.verificaValidTouched(campo),
      'was-validated': this.verificaValidTouched(campo)
    }
  }

  consultaCEP(cep: any, form: any) {
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)?.subscribe(dados => this.populaDadosForm(dados, form));
    }

  }

  populaDadosForm(dados: any, form: any) {
    // form.setValue({
    //   nome: form.value.nome,
    //   email: form.value.email,
    //   endereco: {
    //   rua: dados.logradouro,
    //   cep: dados.cep,
    //   numero: '',
    //   complemento: dados.complemento,
    //   bairro: dados.bairro,
    //   cidade: dados.localidade,
    //   estado: dados.uf
    //   }
    // });

    form.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });

    // console.log(form);
  }

  resetaDadosForm(form: any) {
    form.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

}

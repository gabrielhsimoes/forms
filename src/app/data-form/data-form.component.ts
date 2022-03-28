import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    
    ) { }

  ngOnInit(): void {

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required], //[Validators.minLength(3), Validators.maxLength(10)]
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({

        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }

  onSubmit(){
    console.log(this.formulario);

    this.http.post('https://httpbin.org/post', 
      JSON.stringify(this.formulario.value))
      .pipe(map(res => res)).subscribe(dados => {
          console.log(dados);
          // this.formulario.reset();
          // this.resetar();
          },
          (error: any) => alert('Ocorreu um erro!'));

  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: string){
    return !this.formulario.get(campo)?.valid && this.formulario.get(campo)?.touched;
  }

  // verificaEmailInvalido(){
  //    if(this.formulario.status==='INVALID'){
  //      return this.formulario.status
  //    }
  // }

  aplicaCSSErro(campo: string){
    return {
      'needs-validation': this.verificaValidTouched(campo),
      'was-validated': this.verificaValidTouched(campo)
    }
  }

}

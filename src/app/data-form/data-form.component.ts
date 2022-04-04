import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { FormValidations } from '../shared/form-validations';
import { EstadoBr } from '../shared/models/estado-br';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;
  // estados: EstadoBr[]= [];
  estados!: Observable<EstadoBr[]>;
  cargos!: any[];
  tecnologias!: any[];
  newsletterOp!: any[];

  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService

  ) {
  }

  ngOnInit(): void {

    this.estados = this.dropdownService.getEstadosBr();
    this.cargos = this.dropdownService.getCargos();

    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsletter();
    // this.dropdownService.getEstadosBr().subscribe(res =>{
    // this.estados = res;
    // // console.log("teste");
    // console.log(res);
    // })

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required], //[Validators.minLength(3), Validators.maxLength(10)]
      email: [null, [Validators.required, Validators.email]],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],

      endereco: this.formBuilder.group({

        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),

      cargo: [null],
      tecnologias: [null],
      // newsletter: [null]
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });

    console.log(this.buildFrameworks());
    console.log(this.formulario);
  }


  buildFrameworks(){
    const values = this.frameworks.map(v => new FormControl(false));

    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));

    // this.formBuilder.array ([
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false)
    // ])
  }

  getFrameworksControls(){
    return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
  }

  
  CEPHasError(){
    return this.formulario.get('endereco.cep')?.hasError('cepInvalido');
  }
  ConfirmarEmailError(){
    return this.formulario.get('confirmarEmail')?.hasError('equalsTo');
  }

  onSubmit() {
    // console.log(this.formulario.valid);

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v: any, i: any) => v ? this.frameworks[i] : null ).filter((v: any) => v !== null)
    });

    console.log(valueSubmit);

    if (this.formulario.valid) {
      this.http.post('https://httpbin.org/post',
        JSON.stringify(valueSubmit))
        .pipe(map(res => res)).subscribe(dados => {
          console.log(dados);
          // this.formulario.reset();
          // this.resetar();
        },
          (error: any) => alert('Ocorreu um erro!'));
    } else {
      console.log('formulario inválido!');
      this.verificaValidacoesForm(this.formulario);

    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);

      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      // controle?.markAsTouched

      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

  verificaValidTouched(campo: any) { //Verifica se o campo é invalido E verifica se ele foi tocado OU modificado!
    return !this.formulario.get(campo)?.valid && (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty);
  }

  verificaRequired(campo: string){
    return (
      this.formulario.get(campo)?.hasError('required') &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    )
  }
  // verificaEmailInvalido(){
  //    if(this.formulario.status==='INVALID'){
  //      return this.formulario.status
  //    }
  // }

  aplicaCSSErro(campo: string) {
    return {
      'needs-validation': this.verificaValidTouched(campo),
      'was-validated': this.verificaValidTouched(campo),

    }
  }

  consultaCEP() {

    let cep = this.formulario.get('endereco.cep')?.value

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)?.subscribe(dados => this.populaDadosForm(dados));
    }
  }


  populaDadosForm(dados: any) {

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  setarCargo(){
    const cargo =  { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1: any, obj2: any){
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  setarTecnologias(){
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript', 'php'])
  }

}

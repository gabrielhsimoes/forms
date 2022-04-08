import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<div></div>',
})
export abstract class BaseFormComponent {

  formulario!: FormGroup

  constructor() { }

  abstract submit(): any;

  onSubmit() {
    if (this.formulario.valid) {
      this.submit()
    } else {
      console.log('formulario inválido!');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);

      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      // controle?.markAsTouched

      if (controle instanceof FormGroup || controle instanceof FormArray) {
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

  verificaRequired(campo: string) {
    return (
      this.formulario.get(campo)?.hasError('required') &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    )
  }

  aplicaCSSErro(campo: string) {
    return {
      'form-control': this.verificaValidTouched(campo),
      'is-invalid': this.verificaValidTouched(campo),

    }
  }

}

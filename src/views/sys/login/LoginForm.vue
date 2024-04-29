<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <FormItem name="captchaCode" class="enter-x">
      <Input
        v-model:value="formData.captchaCode"
        size="large"
        class="captchaCode"
        :placeholder="t('sys.login.verificationCode')"
      >
        <template #addonAfter>
          <img :src="codeUrl" alt="图形验证码" title="看不清，换一张" @click="getCode" />
        </template>
      </Input>
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import { getPermCode } from '@/api/sys/user';
  import { Checkbox, Form, Input, Row, Col, Button } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import { HashingFactory } from '@/utils/cipher';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData = reactive({
    account: '',
    password: '',
    captchaCode: '',
    verifyUUID: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  const encrypt: (string) => string = (password: string) => {
    const md5 = HashingFactory.createMD5Hashing();
    const md5Password = md5.hash(password);
    const list = md5Password.split('');
    if (list && list?.length) {
      [list[8], list[16], list[18], list[21]] = [list[16], list[8], list[21], list[18]];
    }
    return list.join('');
  };

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const password = encrypt(data.password);
      const userInfo = await userStore.login({
        password: password,
        account: data.account,
        captchaCode: data.captchaCode,
        verifyUUID: formData.verifyUUID,
        type: 2,
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.nickName ? userInfo.nickName : userInfo.account}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  // 获取验证码
  const codeUrl = ref('');
  const getCode = async () => {
    const { img, uuid } = await getPermCode();
    formData.verifyUUID = uuid;
    codeUrl.value = 'data:image/gif;base64,' + img;
  };
  getCode();
</script>
<style lang="scss" scoped>
  :deep(.captchaCode) {
    .ant-input-group-addon {
      padding: 0;
    }
  }
</style>

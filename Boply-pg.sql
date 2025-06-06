PGDMP  	    *                }           boplydb    16.8 (Debian 16.8-1.pgdg120+1)    17.4 9    q           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            r           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            s           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            t           1262    16389    boplydb    DATABASE     r   CREATE DATABASE boplydb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE boplydb;
                     boply_admin    false            u           0    0    boplydb    DATABASE PROPERTIES     0   ALTER DATABASE boplydb SET "TimeZone" TO 'utc';
                          boply_admin    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                     boply_admin    false            v           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                        boply_admin    false    5            �            1255    16643    update_updated_at_column()    FUNCTION     �   CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
 1   DROP FUNCTION public.update_updated_at_column();
       public               boply_admin    false    5            �            1259    16412    comments_id_seq    SEQUENCE     x   CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comments_id_seq;
       public               boply_admin    false    5            �            1259    16444    comments    TABLE       CREATE TABLE public.comments (
    id integer DEFAULT nextval('public.comments_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    post_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.comments;
       public         heap r       boply_admin    false    217    5            �            1259    16652    follows    TABLE     k   CREATE TABLE public.follows (
    id integer NOT NULL,
    follower_id integer,
    followed_id integer
);
    DROP TABLE public.follows;
       public         heap r       boply_admin    false    5            �            1259    16651    follows_id_seq    SEQUENCE     �   CREATE SEQUENCE public.follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.follows_id_seq;
       public               boply_admin    false    5    226            w           0    0    follows_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;
          public               boply_admin    false    225            �            1259    16413    messages_id_seq    SEQUENCE     x   CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.messages_id_seq;
       public               boply_admin    false    5            �            1259    16463    messages    TABLE       CREATE TABLE public.messages (
    id integer DEFAULT nextval('public.messages_id_seq'::regclass) NOT NULL,
    sender_id integer,
    receiver_id integer,
    message_body text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.messages;
       public         heap r       boply_admin    false    218    5            �            1259    16671    notes    TABLE     �   CREATE TABLE public.notes (
    id integer NOT NULL,
    user_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.notes;
       public         heap r       boply_admin    false    5            �            1259    16670    notes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.notes_id_seq;
       public               boply_admin    false    5    228            x           0    0    notes_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;
          public               boply_admin    false    227            �            1259    16414    notifications_id_seq    SEQUENCE     }   CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.notifications_id_seq;
       public               boply_admin    false    5            �            1259    16482    notifications    TABLE     7  CREATE TABLE public.notifications (
    id integer DEFAULT nextval('public.notifications_id_seq'::regclass) NOT NULL,
    user_id integer,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.notifications;
       public         heap r       boply_admin    false    219    5            �            1259    16411    posts_id_seq    SEQUENCE     u   CREATE SEQUENCE public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.posts_id_seq;
       public               boply_admin    false    5            �            1259    16429    posts    TABLE     p  CREATE TABLE public.posts (
    id integer DEFAULT nextval('public.posts_id_seq'::regclass) NOT NULL,
    user_id integer,
    content text NOT NULL,
    image_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    likes integer DEFAULT 0 NOT NULL
);
    DROP TABLE public.posts;
       public         heap r       boply_admin    false    216    5            �            1259    16410    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               boply_admin    false    5            �            1259    16624    users    TABLE     &  CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    username character varying(255) NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    profile_picture character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bio text,
    cover_image text
);
    DROP TABLE public.users;
       public         heap r       boply_admin    false    215    5            �           2604    16655 
   follows id    DEFAULT     h   ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);
 9   ALTER TABLE public.follows ALTER COLUMN id DROP DEFAULT;
       public               boply_admin    false    226    225    226            �           2604    16674    notes id    DEFAULT     d   ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);
 7   ALTER TABLE public.notes ALTER COLUMN id DROP DEFAULT;
       public               boply_admin    false    228    227    228            g          0    16444    comments 
   TABLE DATA           M   COPY public.comments (id, user_id, post_id, content, created_at) FROM stdin;
    public               boply_admin    false    221   \D       l          0    16652    follows 
   TABLE DATA           ?   COPY public.follows (id, follower_id, followed_id) FROM stdin;
    public               boply_admin    false    226   �G       h          0    16463    messages 
   TABLE DATA           Y   COPY public.messages (id, sender_id, receiver_id, message_body, "timestamp") FROM stdin;
    public               boply_admin    false    222   �G       n          0    16671    notes 
   TABLE DATA           A   COPY public.notes (id, user_id, content, created_at) FROM stdin;
    public               boply_admin    false    228   �G       i          0    16482    notifications 
   TABLE DATA           U   COPY public.notifications (id, user_id, type, message, read, created_at) FROM stdin;
    public               boply_admin    false    223   �H       f          0    16429    posts 
   TABLE DATA           _   COPY public.posts (id, user_id, content, image_url, created_at, updated_at, likes) FROM stdin;
    public               boply_admin    false    220   �H       j          0    16624    users 
   TABLE DATA           �   COPY public.users (id, username, firstname, lastname, email, password, profile_picture, created_at, updated_at, bio, cover_image) FROM stdin;
    public               boply_admin    false    224   K       y           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 31, true);
          public               boply_admin    false    217            z           0    0    follows_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.follows_id_seq', 2, true);
          public               boply_admin    false    225            {           0    0    messages_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.messages_id_seq', 1, false);
          public               boply_admin    false    218            |           0    0    notes_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.notes_id_seq', 6, true);
          public               boply_admin    false    227            }           0    0    notifications_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);
          public               boply_admin    false    219            ~           0    0    posts_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.posts_id_seq', 14, true);
          public               boply_admin    false    216                       0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 12, true);
          public               boply_admin    false    215            �           2606    16452    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public                 boply_admin    false    221            �           2606    16659 +   follows follows_follower_id_followed_id_key 
   CONSTRAINT     z   ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_followed_id_key UNIQUE (follower_id, followed_id);
 U   ALTER TABLE ONLY public.follows DROP CONSTRAINT follows_follower_id_followed_id_key;
       public                 boply_admin    false    226    226            �           2606    16657    follows follows_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.follows DROP CONSTRAINT follows_pkey;
       public                 boply_admin    false    226            �           2606    16471    messages messages_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public                 boply_admin    false    222            �           2606    16679    notes notes_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_pkey;
       public                 boply_admin    false    228            �           2606    16491     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 boply_admin    false    223            �           2606    16438    posts posts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public                 boply_admin    false    220            �           2606    16635    users users_new_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_new_email_key UNIQUE (email);
 C   ALTER TABLE ONLY public.users DROP CONSTRAINT users_new_email_key;
       public                 boply_admin    false    224            �           2606    16633    users users_new_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_new_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.users DROP CONSTRAINT users_new_pkey;
       public                 boply_admin    false    224            �           2606    16637    users users_new_username_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_new_username_key UNIQUE (username);
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT users_new_username_key;
       public                 boply_admin    false    224            �           2620    16644    users update_users_updated_at    TRIGGER     �   CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
 6   DROP TRIGGER update_users_updated_at ON public.users;
       public               boply_admin    false    229    224            �           2606    16453    comments comments_post_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_post_id_fkey;
       public               boply_admin    false    3256    221    220            �           2606    16646    comments comments_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
 H   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_user_id_fkey;
       public               boply_admin    false    3266    224    221            �           2606    16638    posts fk_user    FK CONSTRAINT     ~   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 7   ALTER TABLE ONLY public.posts DROP CONSTRAINT fk_user;
       public               boply_admin    false    3266    220    224            �           2606    16665     follows follows_followed_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public.users(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.follows DROP CONSTRAINT follows_followed_id_fkey;
       public               boply_admin    false    3266    226    224            �           2606    16660     follows follows_follower_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.follows DROP CONSTRAINT follows_follower_id_fkey;
       public               boply_admin    false    224    3266    226            �           2606    16680    notes notes_user_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 B   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_user_id_fkey;
       public               boply_admin    false    224    3266    228            g   P  x�mU�n#G�w�bk<���8���P���\�+}����P�8���OpϮ$rWTW�tUu
[���n�MuW6
�h.��@��E����@�N�qR�e� �mST��|�\�j�?~��T�%���n
�^(�r��}�O5�VUu�A|Du�[�B�Ӻ�����u��u٤4��(U4A8��f{�;�'C���E0�G��Q�)�ݦ��I�tӥ��|�t�@��uh#� m}p��ߩ�ݪ|�\4V�	h�¸����X˷ЖK��F�B��1��Ϧ���f~�=�v7[U��� Fd<�����KY�u�x~���%�2�7^X <�s���O�s@��T��9A�ؼn:O]W^��:+M�z�PQ;=�v�x�t��j����;y�^O��̑S��l�r93xZጔF3p��/��O�$����!����������W��b�O�o���>h�	gP�Ѓ���j�7�CS�ͨ<Ĝ�<��N1��s��2�y�>��I���/l��Y�9����]�ۆ���뉚A�DJ��1ā���W��b��6��^���OV�q0Q�lE �:N�r�|�АgV����p(��f���}�}�@i�	�Ô��Q���d�i������~��ltI��~��G{�of�)�?QV׻٬����:����u}]L�Y�u�?\]�v�峴<>��*ovUU��v������CINA0�v e6K���>�r�ږnC�u|K�#��T��O��%q���x���)?��IQ��)��?��%M�u��E�Ԃxh�����`�T$}迈�h�a
9f/r<U�����y�s�jîc�	_�      l      x�3�4�4����� 	(b      h      x������ � �      n   �   x�e�;�0k��@,��k;�(h)e��XQ m�p��$Ñ�S���(N�^�YeV�P=�|��ģ����i�s���4H���� �k5Qk�����RS�/�'p	��h]5�f�KQe��%��o�2�*6&�t�ф ��b��+|��1��7���3>X����?[���<�촔�	��D=      i      x������ � �      f     x�}S9n�@�9�hÁ#z.r8�"��B%���s�h=¹3'������^��Ʉ�����*��I���1º���@Ϫo�oe�<�'��As#%�u2�J�J�9�$�>�s&�:�(%����)b��K�F���P��ژ�C��6S&�� dB'B&_�b@�&,�� ��;�$��u�r�{nCz���5Ћ�c ߶�á�B���Tʭ�āI� ���@{A'B_��hR9i��9jaL6!Kl�T�*��v��L����B������&G�0��萮�<Uʠ���Yb��T�f��~�g����>
u�EՆ�\IH',V�+A�rR:�w�J�.Ehi� Oۏ�#v"$4���k�O�N!���]�aA	�TŧS2� �Lri�1vL��$u�)ptU	�7JJ�Ī��n?"����\P�w&�T��ԜCi�Į���MNM�="� ����V�4�s2Mܿt�2n��_֣�d����0������m����S�@Y��8V
��S���}�o/TUgNK��$�� d��1���L�      j   �  x�}T�N�H|v��#�8vz_���%��	E��v{	���,�3�K����2p�ڧ�R[u��l��vWlunL����f�8��Zŉ]/��@p0򁞶�7�QSD��t�0-�~+�̰7aW�M\Ͽ:9>]����X�� � 2!ph5��@��U���,�1ݯ�St��z�h���o<�)��'�֏Iy���B�S��.?�u��0�����j]t������'��D�����"��^X2c�Z�/r֫��)n[����M��T��ɪ�����0����,:�	,6箺���H��b�d��67yĉ��^r"$�s��)����� �,�y�"LaK
 - ����^m�A�P� a){E��	�C��͸@�*4�8ITn�*W�.��V���Y�����n�H���,_�#��1��R��+�Pb"-����<�X�TjN�Ǫ�j�j��u��,ea0�+�F�˾�v��_��Jښ���]��D�T�_��w����"!Q%(�V�V��,2tq*z�&�;��	e�eI.�0���osU���On��z�ssW>���#� +r��j��'_r;�N{h�m���np�\t��L�<���b�1�e���_:�!����F%�<P����<�C�(=E!PR��@�����I�6 6E�3�a`��PlC
(uq���SY	QF���תt��_��	Y�,o{	�M���I�DƑ��S��Ta�E������ۗ�a��Y�BO?4�'����~5��x�#[x�U�G�f�C�''c�X���,��D%E��j�EjgAB	�!�I�W%��lZ����V"!��r��}5E���f���yѻUT��_��"r�1'�=�%\ªr0� ���݀��R���oJ��w��i�WR�%�?�q|�̊s�����ô��/��E_>���ڙ�U��c۬]O^��	zi���h�C��     